import express from "express";

import validateRequest from "#middleware/validateRequest.js";
import { getBlocksByCardIdSchema } from "#schemas/blocks.js";
import { getBlocksByCardId } from "#services/block.js";
import asyncHandler from "#utils/asyncHandler.js";

const router = express.Router({ mergeParams: true });

router.get(
  "/",
  validateRequest(getBlocksByCardIdSchema),
  asyncHandler(async (req, res) => {
    const { cardId } = req.params;
    const blocks = await getBlocksByCardId(cardId);

    res.status(200).json({ blocks });
  })
);

export default router;
