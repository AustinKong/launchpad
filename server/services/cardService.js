import ApiError from "#utils/ApiError.js";
import prisma from "#prisma/prismaClient.js";

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

export async function createCard(userId, title, slug) {
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
    if (err.code === "P2002") {
      throw new ApiError(400, "Card with this URL already exists");
    }
    throw new ApiError(500, "Internal server error", err.message);
  }
}
