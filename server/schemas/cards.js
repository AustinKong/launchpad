import { z } from "zod";

export const getCardByIdSchema = {
  params: z.object({
    cardId: z.string().uuid("Invalid card ID format"),
  }),
};

export const createCardSchema = z.object({
  body: z.object({
    title: z.string().min(1, "Card name is required"),
    slug: z
      .string()
      .min(1, "Card URL is required")
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
        message:
          "Card URL must be lowercase and can only contain letters, numbers, and hyphens",
      }),
  }),
});
