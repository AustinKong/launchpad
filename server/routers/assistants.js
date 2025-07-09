import express from "express";

import validateRequest from "#middleware/validateRequest.js";
import {
  getAssistantByCardIdSchema,
  sendMessageSchema,
} from "#schemas/assistants.js";
import { getAssistantByCardId, sendMessage } from "#services/assistant.js";
import asyncHandler from "#utils/asyncHandler.js";

const router = express.Router({ mergeParams: true });

router.get(
  "/",
  validateRequest(getAssistantByCardIdSchema),
  asyncHandler(async (req, res) => {
    const { cardId } = req.params;
    const assistant = await getAssistantByCardId(cardId);

    res.status(200).json({ assistant });
  })
);

router.post(
  "/message",
  validateRequest(sendMessageSchema),
  asyncHandler(async (req, res) => {
    const { cardId } = req.params;
    const { message } = req.body;

    const reply = await sendMessage({ cardId, message });
    res.status(200).json({ reply });
  })
);

export default router;
