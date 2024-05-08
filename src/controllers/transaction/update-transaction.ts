import {
  IUpdateTransactionController,
  IUpdateTransactionUseCase
} from "@/types";
import { UpdateTransactionSchema, updateTransactionSchema } from "@/schemas";
import {
  badRequest,
  checkIfIdIsValid,
  internalServerError,
  invalidIdResponse,
  success,
  transactionNotFoundResponse
} from "@/controllers/helpers";
import { Request } from "express";

export class UpdateTransactionController
  implements IUpdateTransactionController
{
  constructor(private updateTransactionUseCase: IUpdateTransactionUseCase) {
    this.updateTransactionUseCase = updateTransactionUseCase;
  }
  async updateTransaction(httpRequest: Request) {
    try {
      const transactionId = httpRequest.params.transactionId;

      const isUUID = checkIfIdIsValid(transactionId);

      if (!isUUID) {
        return invalidIdResponse();
      }

      const params: UpdateTransactionSchema = httpRequest.body;

      const validation = await updateTransactionSchema.safeParseAsync(params);

      if (!validation.success) {
        return badRequest("Some provided field is invalid");
      }

      const updatedTransaction =
        await this.updateTransactionUseCase.updateTransaction(
          httpRequest.params.transactionId,
          params
        );

      if (!updatedTransaction) {
        return transactionNotFoundResponse();
      }

      return success({
        data: updatedTransaction
      });
    } catch (error) {
      console.error(error);

      return internalServerError();
    }
  }
}
