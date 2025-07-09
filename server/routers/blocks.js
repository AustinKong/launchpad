import express from "express";
import asyncHandler from "#utils/asyncHandler.js";
import validateRequest from "#middleware/validateRequest.js";
import authenticate from "#middleware/authenticate.js";
import { getBlocksByCardIdSchema } from "#schemas/blocks.js";
import { getBlocksByCardId } from "#services/blockService.js";

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
