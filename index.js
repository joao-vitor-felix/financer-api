import "dotenv/config.js";
import express from "express";
import { CreateUserController } from "./src/controllers/create-user.js";

const app = express();

app.use(express.json());

app.post("/users", async (request, response) => {
  const createUserController = new CreateUserController();
  const { statusCode, body } = await createUserController.createUser(request);
  return response.status(statusCode).send(body);
});

app.listen(process.env.PORT, () =>
  console.log(` Server running on port ${process.env.PORT}`)
);
