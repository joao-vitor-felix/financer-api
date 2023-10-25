import validator from "validator";
import {
  badRequest,
  checkIfIdIsValid,
  created,
  internalServerError,
  invalidIdResponse,
  missingFieldResponse,
  validateRequiredFields
} from "../helpers/index.js";

export class CreateTransactionController {
  constructor(createTransactionUseCase) {
    this.createTransactionUseCase = createTransactionUseCase;
  }

  async createTransaction(httpRequest) {
    try {
      const params = httpRequest.body;

      const requiredFields = ["user_id", "name", "date", "amount", "type"];

      const { ok: isFieldsValid, missingField } = validateRequiredFields(
        params,
        requiredFields
      );

      if (!isFieldsValid) {
        return missingFieldResponse(missingField);
      }

      const isUUID = checkIfIdIsValid(params.user_id);

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
