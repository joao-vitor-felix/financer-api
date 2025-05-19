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

    const user = this.getUserByIdRepository.execute(userId);

    if (!user) {
      throw new UserNotFoundError(userId);
    }

    const transaction = await this.createTransactionRepository.execute({
      userId,
      name,
      date,
      type,
      amount
    });

    return transaction;
  }
}
