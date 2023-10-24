import { v4 as uuidv4 } from "uuid";
import { UserNotFoundError } from "../../errors/user.js";

export class CreateTransactionUseCase {
  constructor(createTransactionRepository, getUserByIdRepository) {
    this.createTransactionRepository = createTransactionRepository;
    this.getUserByIdRepository = getUserByIdRepository;
  }

  async createTransaction(createTransactionParams) {
    const userId = createTransactionParams.user_id;

    const user = this.getUserByIdRepository.getUserById(userId);

    if (!user) {
      throw new UserNotFoundError(userId);
    }

    const transactionId = uuidv4();
    const transaction =
      await this.createTransactionRepository.createTransaction({
        ...createTransactionParams,
        id: transactionId
      });

    return transaction;
  }
}
