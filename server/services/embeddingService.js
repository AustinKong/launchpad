import ApiError from "#utils/ApiError.js";
import prisma from "#prisma/prismaClient.js";
import { getDocumentById } from "#services/documentService.js";
import { readTxtFile, readPdfFile, readDocxFile } from "#utils/fileUtils.js";
import { generateEmbedding } from "#utils/genAi.js";
import { toSql } from "pgvector/utils";
import { v4 as uuidv4 } from "uuid";

// TODO: Implement more complicated chunking logic
async function chunkDocument(textContent, chunkSize = 1000, overlap = 200) {
  const chunks = [];
  let start = 0;

  while (start < textContent.length) {
    const end = Math.min(start + chunkSize, textContent.length);
    const chunk = textContent.slice(start, end);
    chunks.push(chunk);
    start += chunkSize - overlap;
  }

  return chunks;
}

// https://www.npmjs.com/package/pgvector#prisma
async function createEmbedding({ documentId, vector, textChunk }) {
  try {
    const vectorSql = toSql(vector);
    // Add quotation marks around capitalized keywords, else postgres will interpret them as lowercase
    // Convert vector to suported String type before returning
    const [embedding] = await prisma.$queryRaw`
      INSERT INTO "Embedding" ("id", "documentId", "vector", "textChunk")
      VALUES (${uuidv4()}, ${documentId}, ${vectorSql}::vector, ${textChunk})
      RETURNING id, "documentId", "textChunk", "vector"::text, "createdAt"`;
    return embedding;
  } catch (err) {
    throw new ApiError(500, "Internal server error", err.message);
  }
}

export async function embedDocument(documentId) {
  const document = await getDocumentById(documentId);
  const fileExt = document.fileName.split(".").pop().toLowerCase();
  let textContent;

  switch (fileExt) {
    case "pdf":
      textContent = await readPdfFile(document.filePath);
      break;
    case "txt":
      textContent = await readTxtFile(document.filePath);
      break;
    case "docx":
      textContent = await readDocxFile(document.filePath);
      break;
    default:
      throw new ApiError(400, "Unsupported file type for embedding");
  }

  const chunks = await chunkDocument(textContent);
  const embeddings = await Promise.all(
    chunks.map(async (chunk) => {
      const response = await generateEmbedding(chunk);
      const vector = response[0].values;
      return await createEmbedding({ documentId, vector, textChunk: chunk });
    })
  );

  // INFO: Vector column is a string. Convert into array if needed
  return embeddings;
}

export async function getEmbeddingsBySemanticSimilarity(cardId, message) {
  const response = await generateEmbedding(message);
  const vector = response[0].values;
  const vectorSql = toSql(vector);

  const embeddings = await prisma.$queryRaw`
    SELECT embedding."id", embedding."documentId", embedding."vector"::text, embedding."textChunk" 
    FROM "Document" document
    JOIN "Embedding" embedding ON document.id = embedding."documentId"
    WHERE document."cardId" = ${cardId}
    ORDER BY vector <-> ${vectorSql}::vector 
    LIMIT 3 
  `;

  return embeddings;
}
