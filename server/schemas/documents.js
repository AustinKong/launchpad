import { z } from "zod";

export const createDocumentsSchema = {
  params: z.object({
    cardId: z.string().uuid("Invalid card ID format"),
  }),
};

export const embedDocumentSchema = {
  params: z.object({
    docId: z.string().uuid("Invalid document ID format"),
  }),
};
