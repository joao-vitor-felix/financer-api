import { ZodError } from "zod";
import { badRequest, created, internalServerError } from "../helpers/index.js";
import { createTransactionSchema } from "../../schemas/index.js";

export class CreateTransactionController {
  constructor(createTransactionUseCase) {
    this.createTransactionUseCase = createTransactionUseCase;
  }

  async createTransaction(httpRequest) {
    try {
      const params = httpRequest.body;

      await createTransactionSchema.parseAsync(params);

      const transaction =
        await this.createTransactionUseCase.createTransaction(params);

      return created({
        message: "Transaction created successfully.",
        response: transaction
      });
    } catch (error) {
      console.log(error);

      if (error instanceof ZodError) {
        return badRequest({
          message: error.errors[0].message
        });
      }
      return internalServerError();
    }
  }
}
