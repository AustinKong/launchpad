import prisma from "#prisma/prismaClient.js";
import ApiError from "#utils/ApiError.js";

export async function getBlocksByCardId(cardId) {
  const blocks = await prisma.block.findMany({
    where: { cardId },
  });

  return blocks;
}

export async function createBlock({ cardId, id, type, config }, tx = null) {
  const client = tx || prisma;
  try {
    const block = await client.block.create({
      data: {
        id,
        type,
        config,
        cardId,
      },
    });

    return block;
  } catch (err) {
    if (err?.code === "P2002") {
      throw new ApiError(400, "Block with this ID already exists");
    }
    throw new ApiError(500, "Internal server error", err.message);
  }
}

export async function createBlocks({ cardId, blocks }, tx = null) {
  const client = tx || prisma;
  try {
    const createdBlocks = await client.block.createMany({
      data: blocks.map((block) => ({
        type: block.type,
        config: block.config,
        cardId,
      })),
    });

    return createdBlocks;
  } catch (err) {
    if (err?.code === "P2002") {
      throw new ApiError(400, "One or more blocks already exist");
    }
    throw new ApiError(500, "Internal server error", err.message);
  }
}

export async function deleteBlock(id, tx = null) {
  const client = tx || prisma;
  try {
    const block = await client.block.delete({
      where: { id },
    });

    return block;
  } catch (err) {
    if (err?.code === "P2025") {
      throw new ApiError(404, "Block not found");
    }
    throw new ApiError(500, "Internal server error", err.message);
  }
}

export async function updateBlock({ id, config }, tx = null) {
  const client = tx || prisma;
  try {
    const block = await client.block.update({
      where: { id },
      data: { config },
    });

    return block;
  } catch (err) {
    if (err?.code === "P2025") {
      throw new ApiError(404, "Block not found");
    }
    throw new ApiError(500, "Internal server error", err.message);
  }
}
