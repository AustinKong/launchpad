import dotenv from "dotenv";
import express, { json } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
const app = express();
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import errorHandler from "#middleware/errorHandler.js";
import logger from "#middleware/logger.js";

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(json());
app.use(cookieParser());
app.use(logger);

import authRouter from "#routers/auth.js";
import cardsRouter from "#routers/cards.js";
import blocksRouter from "#routers/blocks.js";
import uploadsRouter from "#routers/uploads.js";

app.use("/api/auth", authRouter);
app.use("/api/cards", cardsRouter);
app.use("/api/cards/:cardId/blocks", blocksRouter);
app.use("/api/uploads", uploadsRouter);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(errorHandler);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});
