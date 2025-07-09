import { z } from "zod";

export const getAssistantByCardIdSchema = {
  params: z.object({
    cardId: z.string().uuid("Invalid card ID format"),
  }),
};

export const sendMessageSchema = {
  params: z.object({
    cardId: z.string().uuid("Invalid card ID format"),
  }),
  body: z.object({
    message: z.string().min(1, "Message cannot be empty"),
  }),
};
