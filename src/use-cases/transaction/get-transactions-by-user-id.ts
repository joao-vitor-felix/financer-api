import {
  IGetTransactionsByUserIdRepository,
  IGetTransactionsByUserIdUseCase
} from "@/types/transaction.js";
import { UserNotFoundError } from "@/errors/user";
import { IGetUserByIdRepository } from "@/types";

export class GetTransactionsByUserIdUseCase
  implements IGetTransactionsByUserIdUseCase
{
  constructor(
    private getTransactionsByUserIdRepository: IGetTransactionsByUserIdRepository,
    private getUserByIdRepository: IGetUserByIdRepository
  ) {}

  async getTransactions(userId: string) {
    const user = await this.getUserByIdRepository.getUserById(userId);

    if (!user) {
      throw new UserNotFoundError(userId);
    }

    const transactions =
      await this.getTransactionsByUserIdRepository.getTransactions(userId);

    return transactions;
  }
}
