import ApiError from "#utils/ApiError";
import prisma from "#prisma/prismaClient.js";

export async function getThemeByCardId(cardId) {
  const theme = await prisma.theme.findUnique({
    where: { cardId },
  });

  if (!theme) {
    throw new ApiError(404, "Theme not found for this card");
  }

  return theme;
}

export async function createTheme({ cardId, config }) {
  try {
    const theme = await prisma.theme.create({
      data: {
        cardId,
        config,
      },
    });

    return theme;
  } catch (err) {
    if (err.code === "P2002") {
      throw new ApiError(400, "Theme for this card already exists");
    }
    throw new ApiError(500, "Internal server error", err.message);
  }
}

export async function updateTheme({ cardId, config }) {
  try {
    const theme = await prisma.theme.update({
      where: { cardId },
      data: { config },
    });

    return theme;
  } catch (err) {
    if (err.code === "P2025") {
      throw new ApiError(404, "Theme not found for this card");
    }
    throw new ApiError(500, "Internal server error", err.message);
  }
}
