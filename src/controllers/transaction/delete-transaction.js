import {
  checkIfIdIsValid,
  invalidIdResponse,
  success,
  internalServerError,
  transactionNotFoundResponse
} from "../helpers/index.js";

export class DeleteTransactionController {
  constructor(deleteTransactionUseCase) {
    this.deleteTransactionUseCase = deleteTransactionUseCase;
  }

  async deleteTransaction(httpRequest) {
    try {
      const transactionId = httpRequest.params.transactionId;
      const isUUID = checkIfIdIsValid(transactionId);

      if (!isUUID) {
        return invalidIdResponse();
      }

      const deletedTransaction =
        await this.deleteTransactionUseCase.deleteTransaction(transactionId);

      if (!deletedTransaction) {
        return transactionNotFoundResponse();
      }

      return success({
        message: "Transaction deleted successfully",
        transaction: deletedTransaction
      });
    } catch (error) {
      console.error(error);

      return internalServerError();
    }
  }
}
