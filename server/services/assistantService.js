import ApiError from "#utils/ApiError.js";
import prisma from "#prisma/prismaClient.js";
import { getEmbeddingsBySemanticSimilarity } from "#services/embeddingService.js";
import { generateText } from "#utils/genAi.js";
import defaultAssistantConfig from "#data/defaultAssistantConfig.js";

export async function getAssistantByCardId(cardId) {
  const assistant = await prisma.assistant.findUnique({
    where: { cardId },
  });

  if (!assistant) {
    throw new ApiError(404, "Assistant not found for this card");
  }

  return assistant;
}

export async function createAssistant(
  { cardId, config = defaultAssistantConfig },
  tx = null
) {
  const client = tx || prisma;

  try {
    const assistant = await client.assistant.create({
      data: {
        cardId,
        config,
      },
    });
    return assistant;
  } catch (err) {
    if (err?.code === "P2002") {
      throw new ApiError(400, "Assistant for this card already exists");
    }
    throw new ApiError(500, "Internal server error", err.message);
  }
}

export async function sendMessage({ cardId, message }) {
  // Read personality etc. from the assistant
  const assistant = await getAssistantByCardId(cardId);
  const embeddings = await getEmbeddingsBySemanticSimilarity(cardId, message);

  const prompt = `
    Use the following context to reply the user's message:
    Context: ${embeddings.map((e) => e.textChunk).join("\n\n")}
    User's message: ${message}
  `;

  const reply = await generateText(prompt);
  return reply;
}
