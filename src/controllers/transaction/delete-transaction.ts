import { Request } from "express";

import {
  checkIfIdIsValid,
  internalServerError,
  invalidIdResponse,
  success,
  transactionNotFoundResponse
} from "@/controllers/helpers";
import { DeleteTransactionUseCase } from "@/use-cases";

export class DeleteTransactionController {
  constructor(private deleteTransactionUseCase: DeleteTransactionUseCase) {}

  async execute(httpRequest: Request) {
    try {
      const transactionId = httpRequest.params.transactionId;
      const isUUID = checkIfIdIsValid(transactionId);

      if (!isUUID) {
        return invalidIdResponse();
      }

      const response =
        await this.deleteTransactionUseCase.execute(transactionId);

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
