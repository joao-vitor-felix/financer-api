import { UserNotFoundError } from "@/errors/user";
import { IGetUserByIdRepository } from "@/types";
import { IGetTransactionsByUserIdRepository } from "@/types/transaction.js";

export class GetTransactionsByUserIdUseCase {
  constructor(
    private getTransactionsByUserIdRepository: IGetTransactionsByUserIdRepository,
    private getUserByIdRepository: IGetUserByIdRepository
  ) {}

  async execute(userId: string) {
    const user = await this.getUserByIdRepository.getUserById(userId);

    if (!user) {
      throw new UserNotFoundError(userId);
    }

    const transactions =
      await this.getTransactionsByUserIdRepository.getTransactions(userId);

    return transactions;
  }
}
