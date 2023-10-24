import validator from "validator";
import {
  badRequest,
  checkIfIdIsValid,
  created,
  internalServerError,
  invalidIdResponse
} from "../helpers/index.js";

export class CreateTransactionController {
  constructor(createTransactionUseCase) {
    this.createTransactionUseCase = createTransactionUseCase;
  }

  async createTransaction(httpRequest) {
    try {
      const params = httpRequest.body;

      const requiredFields = ["user_id", "name", "date", "amount", "type"];

      for (const field of requiredFields) {
        if (!params[field] || params[field].toString().trim().length === 0) {
          return badRequest({ message: `Missing param: ${field}` });
        }
      }

      const isUUID = checkIfIdIsValid(params.id);

      if (!isUUID) {
        return invalidIdResponse();
      }

      if (params.amount <= 0) {
        return badRequest({ message: "Amount must be greater than 0." });
      }

      const isAmountValid = validator.isDecimal(params.amount.toString(), {
        digits_after_decimal: [2],
        allow_negatives: false,
        decimal_separator: ","
      });

      if (!isAmountValid) {
        return badRequest({ message: "Invalid amount." });
      }

      const type = params.type.trim().toUpperCase();

      const isTypeValid = ["EARNING", "EXPENSE", "INVESTMENT"].includes(type);

      if (!isTypeValid) {
        return badRequest({
          message: "The type must be EARNING, EXPENSE or INVESTMENT."
        });
      }

      const transaction = await this.createTransactionUseCase.createTransaction(
        {
          ...params,
          type
        }
      );

      return created({
        message: "Transaction created successfully.",
        response: transaction
      });
    } catch (error) {
      console.log(error);
      return internalServerError();
    }
  }
}
