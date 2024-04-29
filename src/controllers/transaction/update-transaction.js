import { updateTransactionSchema } from "../../schemas/transaction.js";
import {
  badRequest,
  checkIfIdIsValid,
  internalServerError,
  invalidIdResponse,
  success,
  transactionNotFoundResponse
} from "../helpers/index.js";

export class UpdateTransactionController {
  constructor(updateTransactionUseCase) {
    this.updateTransactionUseCase = updateTransactionUseCase;
  }
  async updateTransaction(httpRequest) {
    try {
      const transactionId = httpRequest.params.transactionId;

      const isUUID = checkIfIdIsValid(transactionId);

      if (!isUUID) {
        return invalidIdResponse();
      }

      const params = httpRequest.body;

      const validation = await updateTransactionSchema.safeParseAsync(params);

      if (!validation.success) {
        return badRequest({ message: "Some provided field is invalid" });
      }

      const updatedTransaction =
        await this.updateTransactionUseCase.updateTransaction(
          httpRequest.params.transactionId,
          params
        );

      if (!updatedTransaction) {
        return transactionNotFoundResponse();
      }

      return success(updatedTransaction);
    } catch (error) {
      console.error(error);

      return internalServerError();
    }
  }
}
