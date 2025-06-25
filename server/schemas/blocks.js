import { z } from "zod";

export const getBlocksByCardIdSchema = {
  params: z.object({
    cardId: z.string().uuid("Invalid card ID format"),
  }),
};
