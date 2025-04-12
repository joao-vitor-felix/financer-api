import { TransactionNotFoundError } from "@/errors/transaction";
import { IDeleteTransactionRepository } from "@/types";

export class DeleteTransactionUseCase {
  constructor(
    private deleteTransactionRepository: IDeleteTransactionRepository
  ) {
    this.deleteTransactionRepository = deleteTransactionRepository;
  }

  async execute(transactionId: string) {
    const transaction =
      await this.deleteTransactionRepository.deleteTransaction(transactionId);

    if (transaction === null) {
      throw new TransactionNotFoundError();
    }

    return transaction;
  }
}
