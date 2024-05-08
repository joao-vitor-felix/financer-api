import { Request } from "express";
import { ZodError } from "zod";

import {
  badRequest,
  checkIfIdIsValid,
  internalServerError,
  invalidIdResponse,
  success,
  transactionNotFoundResponse
} from "@/controllers/helpers";
import { UpdateTransactionSchema, updateTransactionSchema } from "@/schemas";
import {
  IUpdateTransactionController,
  IUpdateTransactionUseCase
} from "@/types";

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

      await updateTransactionSchema.parseAsync(params);

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
      if (error instanceof ZodError) {
        return badRequest(error.errors[0].message);
      }

      console.error(error);

      return internalServerError();
    }
  }
}
