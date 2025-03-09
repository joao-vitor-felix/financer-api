import { UpdateTransactionSchema } from "@/schemas";
import { IUpdateTransactionRepository } from "@/types";

export class UpdateTransactionUseCase {
  constructor(
    private updateTransactionRepository: IUpdateTransactionRepository
  ) {}

  async execute(transactionId: string, params: UpdateTransactionSchema) {
    const transaction =
      await this.updateTransactionRepository.updateTransaction(
        transactionId,
        params
      );

    return transaction;
  }
}
