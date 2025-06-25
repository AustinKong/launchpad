import ApiError from "#utils/ApiError.js";
import prisma from "#prisma/prismaClient.js";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { getAddedElements, getRemovedElements } from "#utils/arrayUtils.js";
import {
  createBlock,
  deleteBlock,
  updateBlock,
} from "#services/blockService.js";

export async function getCardsByUserId(userId) {
  const cards = await prisma.card.findMany({
    where: { userId },
  });

  return cards;
}

export async function getCardById(cardId) {
  const card = prisma.card.findUnique({
    where: { id: cardId },
  });

  if (!card) {
    throw new ApiError(404, "Card not found");
  }

  return card;
}

export async function getCardBySlug(slug) {
  const card = await prisma.card.findUnique({
    where: { slug },
  });

  if (!card) {
    throw new ApiError(404, "Card not found");
  }

  return card;
}

export async function createCard({ userId, title, slug }) {
  try {
    const card = await prisma.card.create({
      data: {
        userId,
        title,
        slug,
      },
    });

    return card;
  } catch (err) {
    if (err instanceof PrismaClientKnownRequestError && err.code === "P2002") {
      throw new ApiError(400, "Card with this URL already exists");
    }
    throw new ApiError(500, "Internal server error", err.message);
  }
}

export async function batchUpdateCardBlocks({
  cardId,
  blockEdits,
  blockOrders,
}) {
  const card = await prisma.card.findUnique({
    where: { id: cardId },
  });

  if (!card) {
    throw new ApiError(404, "Card not found");
  }

  const originalBlockOrders = card.blockOrders || [];

  const createdBlockIds = getAddedElements(originalBlockOrders, blockOrders);
  const removedBlockIds = getRemovedElements(originalBlockOrders, blockOrders);
  const updatedBlockIds = Object.keys(blockEdits).filter(
    (id) => originalBlockOrders.includes(id) && !removedBlockIds.includes(id)
  );

  // Initiates a transaction. First creates new blocks, then deletes removed blocks,
  // then updates existing blocks, and finally updates the card's block orders.
  const result = await prisma.$transaction(async (tx) => {
    await Promise.all(
      createdBlockIds.map((blockId) => {
        const blockEdit = blockEdits[blockId];
        if (!blockEdit) {
          throw new ApiError(400, `Block orders must match block edits`);
        }
        return createBlock(
          {
            cardId,
            id: blockId,
            type: blockEdit.type,
            config: blockEdit.config,
          },
          tx
        );
      })
    );

    await Promise.all(
      removedBlockIds.map((blockId) => {
        return deleteBlock({ id: blockId }, tx);
      })
    );

    await Promise.all(
      updatedBlockIds.map((blockId) => {
        const blockEdit = blockEdits[blockId];
        if (!blockEdit) {
          throw new ApiError(400, `Block orders must match block edits`);
        }
        return updateBlock({ id: blockId, config: blockEdit.config }, tx);
      })
    );

    const updatedCard = await tx.card.update({
      where: { id: cardId },
      data: {
        blockOrders,
      },
    });

    const blocks = await tx.block.findMany({
      where: {
        cardId,
      },
    });

    return {
      card: updatedCard,
      blocks,
    };
  });

  return result;
}
