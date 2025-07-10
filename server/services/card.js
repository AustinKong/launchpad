import { getAddedElements, getRemovedElements } from "@launchpad/shared";

import prisma from "#prisma/prismaClient.js";
import { createAssistant } from "#services/assistant.js";
import { createBlock, deleteBlock, updateBlock } from "#services/block.js";
import { createTheme } from "#services/theme.js";
import ApiError from "#utils/ApiError.js";

export async function getCardsByUserId(userId) {
  const cards = await prisma.card.findMany({
    where: { userId },
  });

  return cards;
}

export async function getCardById(id) {
  const card = await prisma.card.findUnique({
    where: { id },
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
    const result = await prisma.$transaction(async (tx) => {
      const card = await tx.card.create({
        data: {
          userId,
          title,
          slug,
        },
      });

      await createTheme({ cardId: card.id }, tx);
      await createAssistant({ cardId: card.id }, tx);

      return card;
    });

    return result;
  } catch (err) {
    if (err?.code === "P2002") {
      throw new ApiError(400, "Card with this URL already exists");
    }
    throw new ApiError(500, "Internal server error", err.message);
  }
}

export async function deleteCard(id) {
  try {
    const card = await prisma.card.delete({
      where: { id },
    });

    return card;
  } catch (err) {
    if (err?.code === "P2025") {
      throw new ApiError(404, "Card not found");
    }
    throw new ApiError(500, "Internal server error", err.message);
  }
}

export async function batchUpdateCardBlocks({
  cardId: id,
  blockEdits,
  blockOrders,
}) {
  const card = await prisma.card.findUnique({
    where: { id },
  });

  if (!card) {
    throw new ApiError(404, "Card not found");
  }

  const originalBlockOrders = card.blockOrders || [];

  const createdBlockIds = getAddedElements(originalBlockOrders, blockOrders);
  const removedBlockIds = getRemovedElements(originalBlockOrders, blockOrders);
  const updatedBlockIds = Object.keys(blockEdits).filter(
    (blockId) =>
      originalBlockOrders.includes(blockId) &&
      !removedBlockIds.includes(blockId)
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
            cardId: id,
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
        return deleteBlock(blockId, tx);
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
      where: { id },
      data: {
        blockOrders,
      },
    });

    const blocks = await tx.block.findMany({
      where: {
        cardId: id,
      },
    });

    return {
      card: updatedCard,
      blocks,
    };
  });

  return result;
}
