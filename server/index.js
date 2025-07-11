import path from "path";
import { fileURLToPath } from "url";

import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express, { json } from "express";

import errorHandler from "#middleware/errorHandler.js";
import logger from "#middleware/logger.js";
import assistantsRouter from "#routers/assistants.js";
import authRouter from "#routers/auth.js";
import blocksRouter from "#routers/blocks.js";
import cardsRouter from "#routers/cards.js";
import documentsRouter from "#routers/documents.js";
import themesRouter from "#routers/themes.js";
import uploadsRouter from "#routers/uploads.js";
import analyticsRouter from "#routers/analytics.js";

const app = express();
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(json());
app.use(cookieParser());
app.use(logger);

// Routers
app.use("/api/auth", authRouter);
app.use("/api/cards", cardsRouter);
app.use("/api/cards/:cardId/assistant", assistantsRouter);
app.use("/api/cards/:cardId/blocks", blocksRouter);
app.use("/api/cards/:cardId/documents", documentsRouter);
app.use("/api/cards/:cardId/theme", themesRouter);
app.use("/api/cards/:cardId/analytics", analyticsRouter);

app.use("/api/uploads", uploadsRouter);
app.use("/uploads", express.static(path.join(__dirname, "storage", "uploads")));

app.use(errorHandler);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});
