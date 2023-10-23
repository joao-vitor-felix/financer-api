import "dotenv/config.js";
import express from "express";
import {
  CreateUserController,
  GetUserByIdController,
  UpdateUserController,
  DeleteUserController
} from "./src/controllers/index.js";
import {
  PostgresCreateUserRepository,
  PostgresGetUserByEmailRepository,
  PostgresGetUserByIdRepository,
  PostgresDeleteUserRepository,
  PostgresUpdateUserRepository
} from "./src/repositories/postgres/index.js";
import {
  CreateUserUseCase,
  GetUserByIdUseCase,
  DeleteUserUseCase,
  UpdateUserUseCase
} from "./src/use-cases/index.js";

const app = express();

app.use(express.json());

app.get(`/api/users/:userId`, async (request, response) => {
  const getUserByRepository = new PostgresGetUserByIdRepository();
  const getUserByIdUseCase = new GetUserByIdUseCase(getUserByRepository);
  const getUserByIdController = new GetUserByIdController(getUserByIdUseCase);

  const { statusCode, body } = await getUserByIdController.getUserById(request);
  return response.status(statusCode).send(body);
});

app.post("/api/users", async (request, response) => {
  const createUserRepository = new PostgresCreateUserRepository();
  const getUserByEmailRepository = new PostgresGetUserByEmailRepository();

  const createUserUseCase = new CreateUserUseCase(
    getUserByEmailRepository,
    createUserRepository
  );

  const createUserController = new CreateUserController(createUserUseCase);
  const { statusCode, body } = await createUserController.createUser(request);
  return response.status(statusCode).send(body);
});

app.patch("/api/users/:userId", async (request, response) => {
  const getUserByEmailRepository = new PostgresGetUserByEmailRepository();
  const updateUserRepository = new PostgresUpdateUserRepository();
  const getUserByIdRepository = new PostgresGetUserByIdRepository();
  const getUserByIdUseCase = new GetUserByIdUseCase(getUserByIdRepository);

  const updateUserUseCase = new UpdateUserUseCase(
    getUserByIdUseCase,
    getUserByEmailRepository,
    updateUserRepository
  );

  const updateUserController = new UpdateUserController(updateUserUseCase);
  const { statusCode, body } = await updateUserController.updateUser(request);
  response.status(statusCode).send(body);
});

app.delete("/api/users/:userId", async (request, response) => {
  const deleteUserRepository = new PostgresDeleteUserRepository();
  const getUserByIdRepository = new PostgresGetUserByIdRepository();

  const getUserByIdUseCase = new GetUserByIdUseCase(getUserByIdRepository);
  const deleteUserUseCase = new DeleteUserUseCase(
    deleteUserRepository,
    getUserByIdUseCase
  );

  const deleteUserController = new DeleteUserController(deleteUserUseCase);

  const { statusCode, body } = await deleteUserController.deleteUser(request);
  response.status(statusCode).send(body);
});

app.listen(process.env.PORT, () =>
  console.log(` Server running on port ${process.env.PORT}`)
);
