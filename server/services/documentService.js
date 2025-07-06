import ApiError from "#utils/ApiError.js";
import prisma from "#prisma/prismaClient.js";

export async function getDocumentsByCardId(cardId) {
  let documents = await prisma.document.findMany({
    where: { cardId },
    include: {
      embeddings: true,
    },
  });
  documents = documents.map((doc) => {
    const { embeddings, ...rest } = doc;
    return {
      ...rest,
      isEmbedded: embeddings.length > 0,
    };
  });

  return documents;
}

export async function getDocumentById(id) {
  const document = await prisma.document.findUnique({
    where: { id },
  });

  if (!document) {
    throw new ApiError(404, "Document not found");
  }

  return document;
}

export async function createDocument({ cardId, fileName, filePath }) {
  try {
    const document = await prisma.document.create({
      data: {
        cardId,
        fileName,
        filePath,
      },
    });
    return document;
  } catch (err) {
    throw new ApiError(500, "Internal server error", err.message);
  }
}

export async function deleteDocument(id) {}
