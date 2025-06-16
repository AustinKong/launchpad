import dotenv from "dotenv";
import express, { json } from "express";
import cors from "cors";
const app = express();
dotenv.config();

import authRouter from "./routers/auth";
import errorHandler from "./middleware/errorHandler";
import logger from "./middleware/logger";

app.use(cors({ origin: true }));
app.use(json());
app.use(logger);

app.use("/auth", authRouter);

app.use(errorHandler);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});
