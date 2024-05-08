import {
  checkIfIdIsValid,
  invalidIdResponse,
  success,
  internalServerError,
  transactionNotFoundResponse
} from "@/controllers/helpers";
import {
  IDeleteTransactionController,
  IDeleteTransactionUseCase
} from "@/types";
import { Request } from "express";

export class DeleteTransactionController
  implements IDeleteTransactionController
{
  constructor(private deleteTransactionUseCase: IDeleteTransactionUseCase) {
    this.deleteTransactionUseCase = deleteTransactionUseCase;
  }

  async deleteTransaction(httpRequest: Request) {
    try {
      const transactionId = httpRequest.params.transactionId;
      const isUUID = checkIfIdIsValid(transactionId);

      if (!isUUID) {
        return invalidIdResponse();
      }

      const response =
        await this.deleteTransactionUseCase.deleteTransaction(transactionId);

      if (response === null) {
        return transactionNotFoundResponse();
      }

      return success({ data: null });
    } catch (error) {
      console.error(error);

      return internalServerError();
    }
  }
}
