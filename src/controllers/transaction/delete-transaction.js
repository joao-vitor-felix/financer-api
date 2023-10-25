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
      const isIdValid = checkIfIdIsValid(httpRequest.params.transactionId);

      if (!isIdValid) {
        return invalidIdResponse();
      }

      const deletedTransaction =
        await this.deleteTransactionUseCase.deleteTransaction(
          httpRequest.params.transactionId
        );

      if (!deletedTransaction) {
        return transactionNotFoundResponse();
      }

      return success({
        message: "Transaction deleted successfully",
        deletedTransaction
      });
    } catch (error) {
      console.error(error);

      return internalServerError();
    }
  }
}
