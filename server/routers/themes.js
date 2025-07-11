import express from "express";

import authenticate from "#middleware/authenticate.js";
import validateRequest from "#middleware/validateRequest.js";
import { getThemeByCardIdSchema, updateThemeSchema } from "#schemas/themes.js";
import { getThemeByCardId, updateTheme } from "#services/theme.js";
import asyncHandler from "#utils/asyncHandler.js";

const router = express.Router({ mergeParams: true });

router.get(
  "/",
  validateRequest(getThemeByCardIdSchema),
  asyncHandler(async (req, res) => {
    const { cardId } = req.params;
    const theme = await getThemeByCardId(cardId);

    res.status(200).json({ theme });
  })
);

// Must be POST to accept beacon requests
router.post(
  "/",
  authenticate,
  validateRequest(updateThemeSchema),
  asyncHandler(async (req, res) => {
    const { cardId } = req.params;
    const { themeEdits } = req.body;

    const updatedTheme = await updateTheme({ cardId, themeEdits });

    res.status(200).json({ theme: updatedTheme });
  })
);

export default router;
