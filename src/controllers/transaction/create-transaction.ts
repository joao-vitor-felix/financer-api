import { Request } from "express";
import { ZodError } from "zod";

import {
  badRequest,
  created,
  internalServerError
} from "@/controllers/helpers";
import { CreateTransactionSchema, createTransactionSchema } from "@/schemas";
import {
  ICreateTransactionController,
  ICreateTransactionUseCase
} from "@/types";
export class CreateTransactionController
  implements ICreateTransactionController
{
  constructor(private createTransactionUseCase: ICreateTransactionUseCase) {}

  async createTransaction(httpRequest: Request) {
    try {
      const params: CreateTransactionSchema = httpRequest.body;

      const validation = await createTransactionSchema.safeParseAsync(params);

      if (!validation.success) {
        return badRequest("Some provided field is invalid");
      }

      const transaction =
        await this.createTransactionUseCase.createTransaction(params);

      return created({
        data: transaction
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
