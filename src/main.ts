import express from "express";

import {
  makeCreateTransactionController,
  makeCreateUserController,
  makeDeleteTransactionController,
  makeDeleteUserController,
  makeGetTransactionsByUserIdController,
  makeGetUserBalanceController,
  makeGetUserByIdController,
  makeUpdateTransactionController,
  makeUpdateUserController
} from "@/factories";

const app = express();
app.use(express.json());

app.get("/users/:userId", async (request, response) => {
  const getUserByIdController = makeGetUserByIdController();
  const { statusCode, body } = await getUserByIdController.execute(request);
  response.status(statusCode).send(body);
});

app.get("/users/:userId/balance", async (request, response) => {
  const getUserBalanceController = makeGetUserBalanceController();
  const { statusCode, body } = await getUserBalanceController.execute(request);
  response.status(statusCode).send(body);
});

app.post("/users", async (request, response) => {
  const createUserController = makeCreateUserController();
  const { statusCode, body } = await createUserController.execute(request);
  response.status(statusCode).send(body);
});

app.patch("/users/:userId", async (request, response) => {
  const updateUserController = makeUpdateUserController();
  const { statusCode, body } = await updateUserController.execute(request);
  response.status(statusCode).send(body);
});

app.delete("/users/:userId", async (request, response) => {
  const deleteUserController = makeDeleteUserController();
  const { statusCode, body } = await deleteUserController.execute(request);
  response.status(statusCode).send(body);
});

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
