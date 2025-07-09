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
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-lite",
      contents: prompt,
      config: {
        systemInstruction: `You are a helpful assistant representing a user on their digital business card. Answer questions based strictly on the provided context. 
          If you do not have enough information to answer accurately, politely inform the visitor that you cannot answer. Do not invent facts. 
          Only share information you are confident is correct based on the available data.`,
      },
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
