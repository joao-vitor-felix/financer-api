import type { Request } from "express";
import { ZodError } from "zod";

import {
  badRequest,
  created,
  internalServerError
} from "@/controllers/helpers";
import { CreateTransactionSchema, createTransactionSchema } from "@/schemas";
import { CreateTransactionUseCase } from "@/use-cases";

export class CreateTransactionController {
  constructor(private createTransactionUseCase: CreateTransactionUseCase) {}

  async execute(httpRequest: Request) {
    try {
      const params: CreateTransactionSchema = httpRequest.body;
      await createTransactionSchema.parseAsync(params);
      const transaction = await this.createTransactionUseCase.execute(params);
      return created(transaction);
    } catch (error) {
      if (error instanceof ZodError) {
        return badRequest(error.errors[0].message);
      }
      console.error(error);
      return internalServerError();
    }
  }
}
