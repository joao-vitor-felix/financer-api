import { UpdateTransactionSchema } from "@/schemas";
import {
  IUpdateTransactionRepository,
  IUpdateTransactionUseCase
} from "@/types";

export class UpdateTransactionUseCase implements IUpdateTransactionUseCase {
  constructor(
    private updateTransactionRepository: IUpdateTransactionRepository
  ) {}

  async updateTransaction(
    transactionId: string,
    params: UpdateTransactionSchema
  ) {
    const transaction =
      await this.updateTransactionRepository.updateTransaction(
        transactionId,
        params
      );

    return transaction;
  }
}
