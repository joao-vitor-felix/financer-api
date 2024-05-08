import {
  IGetUserByIdRepository,
  ICreateTransactionRepository,
  ICreateTransactionUseCase
} from "@/types";
import { UserNotFoundError } from "@/errors/user";
import { CreateTransactionSchema } from "@/schemas";

export class CreateTransactionUseCase implements ICreateTransactionUseCase {
  constructor(
    private createTransactionRepository: ICreateTransactionRepository,
    private getUserByIdRepository: IGetUserByIdRepository
  ) {}

  async createTransaction(params: CreateTransactionSchema) {
    const { userId, name, date, type, amount } = params;

    const user = this.getUserByIdRepository.getUserById(userId);

    if (!user) {
      throw new UserNotFoundError(userId);
    }

    const transaction =
      await this.createTransactionRepository.createTransaction({
        userId,
        name,
        date,
        type,
        amount
      });

    return transaction;
  }
}
