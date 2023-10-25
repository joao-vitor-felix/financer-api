import { UserNotFoundError } from "../../errors/user.js";

export class UpdateTransactionUseCase {
  constructor(updateTransactionRepository, getUserByIdRepository) {
    this.updateTransactionRepository = updateTransactionRepository;
    this.getUserByIdRepository = getUserByIdRepository;
  }

  async updateTransaction(params) {
    const user = await this.getUserByIdRepository.getUserById(params.userId);

    if (!user) {
      throw new UserNotFoundError();
    }

    const transaction =
      await this.updateTransactionRepository.getTransactions(params);

    return transaction;
  }
}
