import {
  CreateTransactionController,
  DeleteTransactionController,
  GetTransactionsByUserIdController,
  UpdateTransactionController
} from "@/controllers";
import {
  PostgresCreateTransactionRepository,
  PostgresDeleteTransactionRepository,
  PostgresGetTransactionsByUserIdRepository,
  PostgresGetUserByIdRepository,
  PostgresUpdateTransactionRepository
} from "@/repositories/postgres";
import {
  CreateTransactionUseCase,
  DeleteTransactionUseCase,
  GetTransactionsByUserIdUseCase,
  UpdateTransactionUseCase
} from "@/use-cases";

export const makeCreateTransactionController = () => {
  const createTransactionRepository = new PostgresCreateTransactionRepository();
  const getUserByIdRepository = new PostgresGetUserByIdRepository();
  const createTransactionUseCase = new CreateTransactionUseCase(
    createTransactionRepository,
    getUserByIdRepository
  );
  const createTransactionController = new CreateTransactionController(
    createTransactionUseCase
  );
  return createTransactionController;
};

export const makeGetTransactionsByUserIdController = () => {
  const getTransactionsByUserIdRepository =
    new PostgresGetTransactionsByUserIdRepository();
  const getUserByIdRepository = new PostgresGetUserByIdRepository();
  const getTransactionsByUserIdUseCase = new GetTransactionsByUserIdUseCase(
    getTransactionsByUserIdRepository,
    getUserByIdRepository
  );
  const getTransactionsByUserIdController =
    new GetTransactionsByUserIdController(getTransactionsByUserIdUseCase);
  return getTransactionsByUserIdController;
};

export const makeUpdateTransactionController = () => {
  const updateTransactionRepository = new PostgresUpdateTransactionRepository();
  const updateTransactionUseCase = new UpdateTransactionUseCase(
    updateTransactionRepository
  );
  const updateTransactionController = new UpdateTransactionController(
    updateTransactionUseCase
  );
  return updateTransactionController;
};

export const makeDeleteTransactionController = () => {
  const deleteTransactionRepository = new PostgresDeleteTransactionRepository();
  const deleteTransactionUseCase = new DeleteTransactionUseCase(
    deleteTransactionRepository
  );
  const deleteTransactionController = new DeleteTransactionController(
    deleteTransactionUseCase
  );
  return deleteTransactionController;
};
