import { z } from "zod";

export const getCardByIdSchema = {
  params: z.object({
    cardId: z.string().uuid("Invalid card ID format"),
  }),
};
