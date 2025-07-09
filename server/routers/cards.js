import express from "express";
import asyncHandler from "#utils/asyncHandler.js";
import validateRequest from "#middleware/validateRequest.js";
import authenticate from "#middleware/authenticate.js";
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
} from "#services/cardService.js";

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
    const type = req.query.type ?? "id";

    let card;
    if (type === "id") {
      card = await getCardById(identifier);
    } else {
      card = await getCardBySlug(identifier);
    }

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

router.patch(
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

// TODO: Implement update card functionality
router.put(
  "/:cardId",
  asyncHandler(async (req, res) => {
    res.sendStatus(501);
  })
);

export default router;
