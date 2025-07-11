import express from "express";

import validateRequest from "#middleware/validateRequest.js";
import { batchCreateAnalyticsEventsSchema } from "#schemas/analytics.js";
import { createAnalyticsEvents } from "#services/analytics.js";
import asyncHandler from "#utils/asyncHandler.js";

const router = express.Router({ mergeParams: true });

router.post(
  "/batch",
  validateRequest(batchCreateAnalyticsEventsSchema),
  asyncHandler(async (req, res) => {
    const { cardId } = req.params;
    const { events } = req.body;
    const createdEvents = createAnalyticsEvents({ cardId, events });

    res.status(201).json({ events: createdEvents });
  })
);

export default router;
