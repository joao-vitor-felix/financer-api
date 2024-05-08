import {
  IDeleteTransactionRepository,
  IDeleteTransactionUseCase
} from "@/types";

export class DeleteTransactionUseCase implements IDeleteTransactionUseCase {
  constructor(
    private deleteTransactionRepository: IDeleteTransactionRepository
  ) {
    this.deleteTransactionRepository = deleteTransactionRepository;
  }

  async deleteTransaction(transactionId: string) {
    const transaction =
      await this.deleteTransactionRepository.deleteTransaction(transactionId);

    return transaction;
  }
}
