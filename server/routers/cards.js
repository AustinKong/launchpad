import express from "express";

import authenticate from "#middleware/authenticate.js";
import validateRequest from "#middleware/validateRequest.js";
import {
  batchUpdateCardBlockSchema,
  createCardSchema,
  getCardByIdentifierSchema,
} from "#schemas/cards.js";
import {
  getCardsByUserId,
  getCardById,
  createCard,
  batchUpdateCardBlocks,
  getCardBySlug,
} from "#services/card.js";
import asyncHandler from "#utils/asyncHandler.js";

const router = express.Router();

router.get(
  "/",
  authenticate,
  asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const cards = await getCardsByUserId(userId);

    res.status(200).json({ cards });
  })
);

router.get(
  "/:identifier",
  validateRequest(getCardByIdentifierSchema),
  asyncHandler(async (req, res) => {
    const { identifier } = req.params;
    const { type } = req.query;

    const card =
      type === "slug"
        ? await getCardBySlug(identifier)
        : await getCardById(identifier);

    res.status(200).json({ card });
  })
);

router.post(
  "/",
  authenticate,
  validateRequest(createCardSchema),
  asyncHandler(async (req, res) => {
    const userId = req.user.sub;
    const { title, slug } = req.body;

    const card = await createCard({ userId, title, slug });

    res.status(201).json({ card });
  })
);

// Must be POST to accept beacon requests
router.post(
  "/:cardId/batch",
  authenticate,
  validateRequest(batchUpdateCardBlockSchema),
  asyncHandler(async (req, res) => {
    const { cardId } = req.params;
    const { blockEdits, blockOrders } = req.body;

    const { card, blocks } = await batchUpdateCardBlocks({
      cardId,
      blockEdits,
      blockOrders,
    });

    res.status(200).json({ card, blocks });
  })
);

export default router;
