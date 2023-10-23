import {
  CreateUserController,
  GetUserByIdController,
  UpdateUserController,
  DeleteUserController
} from "../../controllers/index.js";
import {
  PostgresCreateUserRepository,
  PostgresGetUserByEmailRepository,
  PostgresGetUserByIdRepository,
  PostgresDeleteUserRepository,
  PostgresUpdateUserRepository
} from "../../repositories/postgres/index.js";
import {
  CreateUserUseCase,
  GetUserByIdUseCase,
  DeleteUserUseCase,
  UpdateUserUseCase
} from "../../use-cases/index.js";

export const makeGetUserByIdController = () => {
  const getUserByRepository = new PostgresGetUserByIdRepository();
  const getUserByIdUseCase = new GetUserByIdUseCase(getUserByRepository);
  const getUserByIdController = new GetUserByIdController(getUserByIdUseCase);
  return getUserByIdController;
};

export const makeCreateUserController = () => {
  const createUserRepository = new PostgresCreateUserRepository();
  const getUserByEmailRepository = new PostgresGetUserByEmailRepository();

  const createUserUseCase = new CreateUserUseCase(
    getUserByEmailRepository,
    createUserRepository
  );

  const createUserController = new CreateUserController(createUserUseCase);

  return createUserController;
};

export const makeUpdateUserController = () => {
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

  return updateUserController;
};

export const makeDeleteUserController = () => {
  const deleteUserRepository = new PostgresDeleteUserRepository();
  const getUserByIdRepository = new PostgresGetUserByIdRepository();

  const getUserByIdUseCase = new GetUserByIdUseCase(getUserByIdRepository);
  const deleteUserUseCase = new DeleteUserUseCase(
    deleteUserRepository,
    getUserByIdUseCase
  );

  const deleteUserController = new DeleteUserController(deleteUserUseCase);

  return deleteUserController;
};
