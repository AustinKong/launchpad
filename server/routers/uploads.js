import express from "express";
import asyncHandler from "#utils/asyncHandler.js";
import { imageUpload } from "#middleware/fileUpload.js";

const router = express.Router();

router.post(
  "/image",
  imageUpload,
  asyncHandler(async (req, res) => {
    res.status(200).json({ filePath: `/uploads/${req.file.filename}` });
  })
);

export default router;
