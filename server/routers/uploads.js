import express from "express";

import authenticate from "#middleware/authenticate.js";
import { attachmentUpload, imageUpload } from "#middleware/fileUpload.js";
import asyncHandler from "#utils/asyncHandler.js";

const router = express.Router();

router.post(
  "/image",
  authenticate,
  imageUpload,
  asyncHandler(async (req, res) => {
    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${
      req.file.filename
    }`;
    res.status(200).json({ imageUrl });
  })
);

router.post(
  "/attachment",
  authenticate,
  attachmentUpload,
  asyncHandler(async (req, res) => {
    const attachmentUrl = `${req.protocol}://${req.get("host")}/uploads/${
      req.file.filename
    }`;
    res.status(200).json({ attachmentUrl });
  })
);

export default router;
