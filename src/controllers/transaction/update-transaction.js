import {
  badRequest,
  checkIfIdIsValid,
  internalServerError,
  invalidAmountResponse,
  invalidIdResponse,
  invalidTypeResponse,
  isAmountValidCheck,
  isTypeValidCheck,
  success
} from "../helpers/index.js";

export class UpdateTransactionController {
  constructor(updateTransactionUseCase) {
    this.updateTransactionUseCase = updateTransactionUseCase;
  }
  async updateTransaction(httpRequest) {
    try {
      const isIdValid = checkIfIdIsValid(httpRequest.params.transactionId);

      if (!isIdValid) {
        return invalidIdResponse();
      }

      const params = httpRequest.body;

      const allowedFields = ["name", "date", "amount", "type"];

      const isSomeFieldNotAllowed = Object.keys(params).some(
        field => !allowedFields.includes(field)
      );

      if (isSomeFieldNotAllowed) {
        return badRequest({
          message: "Some provided field is not allowed."
        });
      }

      if (params.amount) {
        const isAmountValid = isAmountValidCheck(params.amount);

        if (!isAmountValid) {
          return invalidAmountResponse();
        }
      }

      if (params.type) {
        const isTypeValid = isTypeValidCheck(params.type);

        if (!isTypeValid) {
          return invalidTypeResponse();
        }
      }

      const transaction = await this.updateTransactionUseCase.updateTransaction(
        httpRequest.params.transactionId,
        params
      );

      return success(transaction);
    } catch (error) {
      console.error(error);

      return internalServerError();
    }
  }
}
