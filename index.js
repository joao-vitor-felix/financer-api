import "dotenv/config.js";
import express from "express";
import {
  CreateUserController,
  GetUserByIdController,
  UpdateUserController
} from "./src/controllers/index.js";

const app = express();

app.use(express.json());

app.post("/api/users", async (request, response) => {
  const createUserController = new CreateUserController();
  const { statusCode, body } = await createUserController.createUser(request);
  return response.status(statusCode).send(body);
});

app.get(`/api/users/:userId`, async (request, response) => {
  const getUserByIdController = new GetUserByIdController();
  const { statusCode, body } = await getUserByIdController.getUserById(request);
  return response.status(statusCode).send(body);
});

app.patch("/api/users/:userId", async (request, response) => {
  const updateUserController = new UpdateUserController();
  const { statusCode, body } = await updateUserController.updateUser(request);
  response.status(statusCode).send(body);
});

app.listen(process.env.PORT, () =>
  console.log(` Server running on port ${process.env.PORT}`)
);
