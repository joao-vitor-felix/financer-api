export class UpdateTransactionUseCase {
  constructor(updateTransactionRepository) {
    this.updateTransactionRepository = updateTransactionRepository;
  }

  async updateTransaction(transactionId, params) {
    const transaction = await this.updateTransactionRepository.getTransactions(
      transactionId,
      params
    );

    return transaction;
  }
}
