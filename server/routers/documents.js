import express from "express";
import asyncHandler from "#utils/asyncHandler.js";
import authenticate from "#middleware/authenticate.js";
import { documentUpload } from "#middleware/fileUpload.js";
import {
  createDocument,
  getDocumentById,
  getDocumentsByCardId,
} from "#services/documentService.js";
import {
  createDocumentsSchema,
  embedDocumentSchema,
} from "#schemas/document.js";
import validateRequest from "#middleware/validateRequest.js";
import { embedDocument } from "#services/embeddingService.js";

const router = express.Router({ mergeParams: true });

router.post(
  "/",
  documentUpload,
  validateRequest(createDocumentsSchema),
  authenticate,
  asyncHandler(async (req, res) => {
    const { cardId } = req.params;
    const documents = await Promise.all(
      req.files.map(async (file) => {
        const { originalname: fileName, path: filePath } = file;
        return createDocument({ cardId, fileName, filePath });
      })
    );

    res.status(201).json({ documents });
  })
);

router.post(
  "/:docId/embed",
  authenticate,
  validateRequest(embedDocumentSchema),
  asyncHandler(async (req, res) => {
    const { docId } = req.params;
    const document = await getDocumentById(docId);
    await embedDocument(docId);

    res.status(201).json({ document });
  })
);

router.get(
  "/",
  authenticate,
  asyncHandler(async (req, res) => {
    const { cardId } = req.params;
    const documents = await getDocumentsByCardId(cardId);

    res.status(200).json({ documents });
  })
);

export default router;
