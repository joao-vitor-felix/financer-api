import express from "express";

import {
  makeCreateTransactionController,
  makeDeleteTransactionController,
  makeGetTransactionsByUserIdController,
  makeUpdateTransactionController
} from "@/factories";

import { usersRouter } from "./routes/user";

const app = express();
app.use(express.json());
app.use("/users", usersRouter);

app.get("/transactions", async (request, response) => {
  const getTransactionsByUserIdController =
    makeGetTransactionsByUserIdController();
  const { statusCode, body } =
    await getTransactionsByUserIdController.execute(request);
  response.status(statusCode).send(body);
});

app.post("/transactions", async (request, response) => {
  const createTransactionController = makeCreateTransactionController();
  const { statusCode, body } =
    await createTransactionController.execute(request);
  response.status(statusCode).send(body);
});

app.patch("/transactions/:transactionId", async (request, response) => {
  const updateTransactionController = makeUpdateTransactionController();
  const { statusCode, body } =
    await updateTransactionController.execute(request);
  response.status(statusCode).send(body);
});

app.delete("/transactions/:transactionId", async (request, response) => {
  const deleteTransactionController = makeDeleteTransactionController();
  const { statusCode, body } =
    await deleteTransactionController.execute(request);
  response.status(statusCode).send(body);
});

const server = app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);

const shutdown = () => {
  console.log("Shutting down server...");
  server.close(() => {
    console.log("Server is shut down");
    process.exit(0);
  });
};
process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
