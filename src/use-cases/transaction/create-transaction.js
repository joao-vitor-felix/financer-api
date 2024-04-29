import { UserNotFoundError } from "../../errors/user.js";

export class CreateTransactionUseCase {
  constructor(createTransactionRepository, getUserByIdRepository) {
    this.createTransactionRepository = createTransactionRepository;
    this.getUserByIdRepository = getUserByIdRepository;
  }

  async createTransaction(createTransactionParams) {
    const { userId, name, date, type, amount } = createTransactionParams;

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
