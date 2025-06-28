import express from "express";
import asyncHandler from "#utils/asyncHandler.js";
import validateRequest from "#middleware/validateRequest.js";
import authenticate from "#middleware/authenticate.js";
import {
  batchUpdateCardBlockSchema,
  createCardSchema,
  getCardByIdSchema,
  getCardBySlugSchema,
} from "#schemas/cards.js";
import {
  getCardsByUserId,
  getCardById,
  createCard,
  batchUpdateCardBlocks,
  getCardBySlug,
} from "#services/cardService.js";

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

router.get(
  "/slug/:slug",
  validateRequest(getCardBySlugSchema),
  asyncHandler(async function (req, res) {
    const { slug } = req.params;
    const card = await getCardBySlug(slug);

    res.status(200).json({ card });
  })
);

router.post(
  "/",
  authenticate,
  validateRequest(createCardSchema),
  asyncHandler(async function (req, res) {
    const userId = req.user.sub;
    const { title, slug } = req.body;

    const card = await createCard({ userId, title, slug });

    res.status(201).json({ card });
  })
);

router.patch(
  "/:cardId/batch",
  authenticate,
  validateRequest(batchUpdateCardBlockSchema),
  asyncHandler(async function (req, res) {
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

// TODO: Implement update card functionality
router.put(
  "/:cardId",
  asyncHandler(async function (req, res) {
    res.sendStatus(501);
  })
);

export default router;
