import ApiError from "#utils/ApiError.js";
import prisma from "#prisma/prismaClient.js";
import { getDocumentById } from "#services/documentService.js";
import { readTxtFile, readPdfFile, readDocxFile } from "#utils/fileUtils.js";
import { generateEmbedding } from "#utils/genAi.js";
import { toSql } from "pgvector/utils";

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
// INFO: If an error that shows (null, [vector ...], "textChunk...", "documentId...") occurs
// It's because Postgres is not correctly giving a default UUID to the row. Run:
// `ALTER TABLE "Embedding" ALTER COLUMN id SET DEFAULT gen_random_uuid();`
async function createEmbedding({ documentId, vector, textChunk }) {
  try {
    const vectorSql = toSql(vector);
    // Add quotation marks around capitalized keywords, else postgres will interpret them as lowercase
    // Convert vector to suported String type before returning
    const [embedding] = await prisma.$queryRaw`
      INSERT INTO "Embedding" ("documentId", "vector", "textChunk")
      VALUES (${documentId}, ${vectorSql}::vector, ${textChunk})
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
