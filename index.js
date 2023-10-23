import "dotenv/config.js";
import express from "express";
import {
  makeCreateUserController,
  makeDeleteUserController,
  makeGetUserByIdController,
  makeUpdateUserController
} from "./src/factories/controllers/user.js";

const app = express();

app.use(express.json());

app.get(`/api/users/:userId`, async (request, response) => {
  const getUserByIdController = makeGetUserByIdController();

  const { statusCode, body } = await getUserByIdController.getUserById(request);
  return response.status(statusCode).send(body);
});

app.post("/api/users", async (request, response) => {
  const createUserController = makeCreateUserController();
  const { statusCode, body } = await createUserController.createUser(request);
  return response.status(statusCode).send(body);
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

app.listen(process.env.PORT, () =>
  console.log(` Server running on port ${process.env.PORT}`)
);
