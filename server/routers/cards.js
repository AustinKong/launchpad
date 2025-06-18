import express from "express";
import asyncHandler from "#utils/asyncHandler.js";
import validateRequest from "#middleware/validateRequest.js";
import authenticate from "#middleware/authenticate.js";
import { getCardByIdSchema } from "#schemas/cards.js";
import { getCardsByUserId, getCardById } from "#services/cardService.js";

const router = express.Router();

router.get(
  "/",
  authenticate,
  asyncHandler(async function (req, res) {
    const userId = req.user.id;
    const cards = await getCardsByUserId(userId);

    res.status(200).json({ cards });
  })
);

router.get(
  "/:cardId",
  validateRequest(getCardByIdSchema),
  asyncHandler(async function (req, res) {
    const { cardId } = req.params;
    const card = await getCardById(cardId);

    res.status(200).json({ card });
  })
);

export default router;
