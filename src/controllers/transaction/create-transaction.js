import {
  badRequest,
  checkIfIdIsValid,
  created,
  internalServerError,
  invalidIdResponse,
  missingFieldResponse,
  validateRequiredFields,
  isAmountValidCheck,
  isTypeValidCheck,
  invalidTypeResponse
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

      const isAmountValid = isAmountValidCheck(params.amount);

      if (!isAmountValid) {
        return badRequest({ message: "Invalid amount." });
      }

      const type = params.type.trim().toUpperCase();

      const isTypeValid = isTypeValidCheck(type);

      if (!isTypeValid) {
        return invalidTypeResponse();
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
