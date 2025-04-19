import type { Request } from "express";
import { ZodError } from "zod";

import {
  badRequest,
  checkIfIdIsValid,
  internalServerError,
  invalidIdResponse,
  success
} from "@/controllers/helpers";
import { updateTransactionSchema } from "@/schemas";
import { UpdateTransactionUseCase } from "@/use-cases";

export class UpdateTransactionController {
  constructor(private updateTransactionUseCase: UpdateTransactionUseCase) {}

  async execute(httpRequest: Request) {
    try {
      const transactionId = httpRequest.params.transactionId;
      const isUUID = checkIfIdIsValid(transactionId);

      if (!isUUID) {
        return invalidIdResponse();
      }

      const params = updateTransactionSchema.parse(httpRequest.body);
      const transaction = await this.updateTransactionUseCase.execute(
        httpRequest.params.transactionId,
        params
      );

      return success(transaction);
    } catch (error) {
      if (error instanceof ZodError) {
        return badRequest(error.errors[0].message);
      }

      console.error(error);
      return internalServerError();
    }
  }
}
