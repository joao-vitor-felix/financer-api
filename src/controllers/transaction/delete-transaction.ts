import type { Request } from "express";

import {
  checkIfIdIsValid,
  internalServerError,
  invalidIdResponse,
  notFound,
  success
} from "@/controllers/helpers";
import { TransactionNotFoundError } from "@/errors";
import { DeleteTransactionUseCase } from "@/use-cases";

export class DeleteTransactionController {
  constructor(private deleteTransactionUseCase: DeleteTransactionUseCase) {}

  async execute(httpRequest: Request) {
    try {
      //TODO: move validation to a zod schema
      const transactionId = httpRequest.params.transactionId;
      const isUUID = checkIfIdIsValid(transactionId);

      if (!isUUID) {
        return invalidIdResponse();
      }

      await this.deleteTransactionUseCase.execute(transactionId);

      return success();
    } catch (error) {
      if (error instanceof TransactionNotFoundError) {
        return notFound("Transaction not found");
      }

      console.error(error);
      return internalServerError();
    }
  }
}
