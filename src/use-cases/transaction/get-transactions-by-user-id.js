import { UserNotFoundError } from "../../errors/user.js";

export class GetTransactionsByUserIdUseCase {
  constructor(getTransactionsByUserIdRepository, getUserByIdRepository) {
    this.getTransactionsByUserIdRepository = getTransactionsByUserIdRepository;
    this.getUserByIdRepository = getUserByIdRepository;
  }

  async getTransactions(params) {
    const user = await this.getUserByIdRepository.getUserById(params.userId);

    if (!user) {
      throw new UserNotFoundError(params.userId);
    }

    const transactions =
      await this.getTransactionsByUserIdRepository.getTransactions(
        params.userId
      );

    return transactions;
  }
}
