import { z } from "zod";

export const batchCreateAnalyticsEventsSchema = {
  params: z.object({
    cardId: z.string().uuid("Invalid card ID format"),
  }),
  body: z.object({
    events: z.array(
      z.object({
        eventType: z.enum(["page_view", "button_click"]),
        createdAt: z.string().datetime("Invalid date format"),
        eventData: z.object({}).passthrough(),
      })
    ),
  }),
};
