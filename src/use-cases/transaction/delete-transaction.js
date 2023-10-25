export class DeleteTransactionUseCase {
  constructor(deleteTransactionRepository) {
    this.deleteTransactionRepository = deleteTransactionRepository;
  }

  async deleteTransaction(transactionId) {
    const transaction =
      await this.deleteTransactionRepository.deleteTransaction(transactionId);

    return transaction;
  }
}
