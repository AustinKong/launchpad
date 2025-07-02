import { z } from "zod";

export const getCardByIdentifierSchema = {
  params: z.object({
    identifier: z.union(
      [z.string().uuid(), z.string().min(1)],
      "Card identifier is required"
    ),
  }),
  query: z.object({
    type: z.enum(["id", "slug"]).optional(),
  }),
};

export const createCardSchema = {
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
};

export const batchUpdateCardBlockSchema = {
  params: z.object({
    cardId: z.string().uuid("Invalid card ID format"),
  }),
  body: z.object({
    blockEdits: z.record(
      z.string().uuid("Invalid block ID format"),
      z
        .object({
          config: z.object({}).passthrough(),
        })
        .passthrough()
    ),
    blockOrders: z.array(z.string().uuid("Invalid block ID format")),
  }),
};
