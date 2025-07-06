import { GoogleGenAI } from "@google/genai";
import ApiError from "#utils/ApiError.js";

const API_KEY = process.env.AI_STUDIO_API_KEY;

if (!API_KEY) {
  throw new Error("AI_STUDIO_API_KEY is not set in environment variables");
}

const ai = new GoogleGenAI({
  apiKey: API_KEY,
});

export async function generateText(prompt, options = {}) {
  try {
    const response = await ai.models.generateText({
      model: "gemini-2.0-flash-lite",
      prompt,
      ...options,
    });
    return response.text;
  } catch (err) {
    throw new ApiError(500, "Failed to generate text", err.message);
  }
}

export async function generateEmbedding(text, options = {}) {
  try {
    const response = await ai.models.embedContent({
      model: "gemini-embedding-exp-03-07",
      contents: text,
      config: {
        taskType: "RETRIEVAL_DOCUMENT",
      },
      ...options,
    });
    return response.embeddings;
  } catch (err) {
    throw new ApiError(500, "Failed to generate embedding", err.message);
  }
}
