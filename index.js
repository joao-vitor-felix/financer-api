import "dotenv/config.js";
import express from "express";
import { CreateUserController } from "./src/controllers/create-user.js";
import { GetUserByIdController } from "./src/controllers/get-user-by-id.js";

const app = express();

app.use(express.json());

app.post("/users", async (request, response) => {
  const createUserController = new CreateUserController();
  const { statusCode, body } = await createUserController.createUser(request);
  return response.status(statusCode).send(body);
});

app.get(`/users/:id`, async (request, response) => {
  const getUserByIdController = new GetUserByIdController();
  const { statusCode, body } = await getUserByIdController.getUserById(request);
  return response.status(statusCode).send(body);
});

app.listen(process.env.PORT, () =>
  console.log(` Server running on port ${process.env.PORT}`)
);
