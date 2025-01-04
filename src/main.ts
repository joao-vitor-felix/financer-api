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

app.get("/api/users/:userId", async (request, response) => {
  const getUserByIdController = makeGetUserByIdController();
  const { statusCode, body } = await getUserByIdController.getUserById(request);
  response.status(statusCode).send(body);
});

app.get("/api/users/:userId/balance", async (request, response) => {
  const getUserBalanceController = makeGetUserBalanceController();
  const { statusCode, body } =
    await getUserBalanceController.getUserBalance(request);
  response.status(statusCode).send(body);
});

app.post("/api/users", async (request, response) => {
  const createUserController = makeCreateUserController();
  const { statusCode, body } = await createUserController.execute(request);
  response.status(statusCode).send(body);
});

app.patch("/api/users/:userId", async (request, response) => {
  const updateUserController = makeUpdateUserController();
  const { statusCode, body } = await updateUserController.updateUser(request);
  response.status(statusCode).send(body);
});

app.delete("/api/users/:userId", async (request, response) => {
  const deleteUserController = makeDeleteUserController();
  const { statusCode, body } = await deleteUserController.deleteUser(request);
  response.status(statusCode).send(body);
});

app.get("/api/transactions", async (request, response) => {
  const getTransactionsByUserIdController =
    makeGetTransactionsByUserIdController();
  const { statusCode, body } =
    await getTransactionsByUserIdController.getTransactions(request);
  response.status(statusCode).send(body);
});

app.post("/api/transactions", async (request, response) => {
  const createTransactionController = makeCreateTransactionController();
  const { statusCode, body } =
    await createTransactionController.createTransaction(request);
  response.status(statusCode).send(body);
});

app.patch("/api/transactions/:transactionId", async (request, response) => {
  const updateTransactionController = makeUpdateTransactionController();
  const { statusCode, body } =
    await updateTransactionController.updateTransaction(request);
  response.status(statusCode).send(body);
});

app.delete("/api/transactions/:transactionId", async (request, response) => {
  const deleteTransactionController = makeDeleteTransactionController();
  const { statusCode, body } =
    await deleteTransactionController.deleteTransaction(request);
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
