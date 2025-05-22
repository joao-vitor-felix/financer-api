import express from "express";

import { transactionsRouter, usersRouter } from "./routes";

export const app = express();

app.use(express.json());
app.use("/users", usersRouter);
app.use("/transactions", transactionsRouter);
