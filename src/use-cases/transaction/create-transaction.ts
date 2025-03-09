import { UserNotFoundError } from "@/errors/user";
import { CreateTransactionSchema } from "@/schemas";
import { ICreateTransactionRepository, IGetUserByIdRepository } from "@/types";

export class CreateTransactionUseCase {
  constructor(
    private createTransactionRepository: ICreateTransactionRepository,
    private getUserByIdRepository: IGetUserByIdRepository
  ) {}

  async execute(params: CreateTransactionSchema) {
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
