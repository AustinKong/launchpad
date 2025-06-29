import { z } from "zod";

export const getThemeByCardIdSchema = {
  params: z.object({
    cardId: z.string().uuid("Invalid card ID format"),
  }),
};

export const updateThemeSchema = {
  params: z.object({
    cardId: z.string().uuid("Invalid card ID format"),
  }),
  body: z.object({
    themeEdits: z.object({}).passthrough(),
  }),
};
