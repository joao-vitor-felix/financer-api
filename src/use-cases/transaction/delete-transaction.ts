import { TransactionNotFoundError } from "@/errors/transaction";
import { IDeleteTransactionRepository } from "@/types";

export class DeleteTransactionUseCase {
  constructor(
    private deleteTransactionRepository: IDeleteTransactionRepository
  ) {}

  async execute(transactionId: string) {
    const transaction =
      await this.deleteTransactionRepository.execute(transactionId);

    if (!transaction) {
      throw new TransactionNotFoundError();
    }
  }
}
