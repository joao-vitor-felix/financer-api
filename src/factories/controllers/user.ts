import { PasswordHasherAdapter } from "@/adapters";
import {
  CreateUserController,
  DeleteUserController,
  GetUserBalanceController,
  GetUserByIdController,
  UpdateUserController
} from "@/controllers";
import {
  PostgresCreateUserRepository,
  PostgresDeleteUserRepository,
  PostgresGetUserBalanceRepository,
  PostgresGetUserByEmailRepository,
  PostgresGetUserByIdRepository,
  PostgresUpdateUserRepository
} from "@/repositories/postgres";
import {
  CreateUserUseCase,
  DeleteUserUseCase,
  GetUserBalanceUseCase,
  GetUserByIdUseCase,
  UpdateUserUseCase
} from "@/use-cases";

export const makeGetUserByIdController = () => {
  const getUserByRepository = new PostgresGetUserByIdRepository();
  const getUserByIdUseCase = new GetUserByIdUseCase(getUserByRepository);
  const getUserByIdController = new GetUserByIdController(getUserByIdUseCase);
  return getUserByIdController;
};

export const makeCreateUserController = () => {
  const createUserRepository = new PostgresCreateUserRepository();
  const getUserByEmailRepository = new PostgresGetUserByEmailRepository();
  const passwordHasherAdapter = new PasswordHasherAdapter();
  const createUserUseCase = new CreateUserUseCase(
    getUserByEmailRepository,
    createUserRepository,
    passwordHasherAdapter
  );
  const createUserController = new CreateUserController(createUserUseCase);
  return createUserController;
};

export const makeUpdateUserController = () => {
  const getUserByEmailRepository = new PostgresGetUserByEmailRepository();
  const updateUserRepository = new PostgresUpdateUserRepository();
  const getUserByIdRepository = new PostgresGetUserByIdRepository();
  const passwordHasherAdapter = new PasswordHasherAdapter();
  const updateUserUseCase = new UpdateUserUseCase(
    getUserByIdRepository,
    getUserByEmailRepository,
    updateUserRepository,
    passwordHasherAdapter
  );
  const updateUserController = new UpdateUserController(updateUserUseCase);
  return updateUserController;
};

export const makeDeleteUserController = () => {
  const deleteUserRepository = new PostgresDeleteUserRepository();
  const getUserByIdRepository = new PostgresGetUserByIdRepository();
  const deleteUserUseCase = new DeleteUserUseCase(
    deleteUserRepository,
    getUserByIdRepository
  );
  const deleteUserController = new DeleteUserController(deleteUserUseCase);
  return deleteUserController;
};

export const makeGetUserBalanceController = () => {
  const getUserByIdRepository = new PostgresGetUserByIdRepository();
  const getUserBalanceRepository = new PostgresGetUserBalanceRepository();
  const getUserBalanceUseCase = new GetUserBalanceUseCase(
    getUserBalanceRepository,
    getUserByIdRepository
  );
  const getUserBalanceController = new GetUserBalanceController(
    getUserBalanceUseCase
  );
  return getUserBalanceController;
};
