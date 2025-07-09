import express from "express";
import asyncHandler from "#utils/asyncHandler.js";
import validateRequest from "#middleware/validateRequest.js";
import authenticate from "#middleware/authenticate.js";
import { getThemeByCardIdSchema, updateThemeSchema } from "#schemas/themes.js";
import { getThemeByCardId, updateTheme } from "#services/themeService.js";

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

router.patch(
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
