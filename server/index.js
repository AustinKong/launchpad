import dotenv from "dotenv";
import express, { json } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();
dotenv.config();

import authRouter from "#routers/auth.js";
import cardsRouter from "#routers/cards.js";
import errorHandler from "#middleware/errorHandler.js";
import logger from "#middleware/logger.js";

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(json());
app.use(cookieParser());
app.use(logger);

app.use("/auth", authRouter);
app.use("/cards", cardsRouter);

app.use(errorHandler);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});
