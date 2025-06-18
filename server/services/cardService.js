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
