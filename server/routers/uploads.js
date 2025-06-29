import express from "express";
import asyncHandler from "#utils/asyncHandler.js";
import { imageUpload } from "#middleware/fileUpload.js";

const router = express.Router();

router.post(
  "/image",
  imageUpload,
  asyncHandler(async (req, res) => {
    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${
      req.file.filename
    }`;
    res.status(200).json({ imageUrl });
  })
);

export default router;
