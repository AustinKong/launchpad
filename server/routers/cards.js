import express from "express";

import authenticate from "#middleware/authenticate.js";
import validateRequest from "#middleware/validateRequest.js";
import {
  batchUpdateCardBlockSchema,
  createCardSchema,
  getCardByIdentifierSchema,
  getCardsSchema,
} from "#schemas/cards.js";
import {
  getCardById,
  createCard,
  batchUpdateCardBlocks,
  getCardBySlug,
  getLibraryCards,
  getArchivedCards,
  getStarredCards,
  getOwnedCards,
} from "#services/card.js";
import asyncHandler from "#utils/asyncHandler.js";

const router = express.Router();

router.get(
  "/",
  authenticate,
  validateRequest(getCardsSchema),
  asyncHandler(async (req, res) => {
    const userId = req.user.sub;
    const { view } = req.query;

    const viewHandlers = {
      starred: () => getStarredCards(userId),
      owned: () => getOwnedCards(userId),
      archived: () => getArchivedCards(userId),
      library: () => getLibraryCards(userId),
    };

    const cards = await viewHandlers[view]();

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
    const { title, slug, templateId } = req.body;

    const card = await createCard({ userId, title, slug, templateId });

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
