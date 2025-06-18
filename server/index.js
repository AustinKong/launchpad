import dotenv from "dotenv";
import express, { json } from "express";
import cors from "cors";
const app = express();
dotenv.config();

import authRouter from "./routers/auth.js";
import errorHandler from "./middleware/errorHandler.js";
import logger from "./middleware/logger.js";

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(json());
app.use(logger);

app.use("/auth", authRouter);

app.use(errorHandler);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});
