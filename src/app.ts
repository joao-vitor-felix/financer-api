import express from "express";
import swaggerUi from "swagger-ui-express";

import swagger from "../docs/swagger.json";
import { transactionsRouter, usersRouter } from "./routes";

export const app = express();

app.use(express.json());
app.use("/users", usersRouter);
app.use("/transactions", transactionsRouter);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swagger));
