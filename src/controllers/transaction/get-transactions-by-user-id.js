import { UserNotFoundError } from "../../errors/user.js";
import {
  checkIfIdIsValid,
  internalServerError,
  invalidIdResponse,
  missingFieldResponse,
  success,
  userNotFoundResponse
} from "../helpers/index.js";

export class GetTransactionsByUserIdController {
  constructor(getTransactionsByUserIdUseCase) {
    this.getTransactionsByUserIdUseCase = getTransactionsByUserIdUseCase;
  }

  async getTransactions(httpRequest) {
    try {
      const userId = httpRequest.query.userId;

      if (!userId) {
        return missingFieldResponse("userId");
      }

      const isUserIdValid = checkIfIdIsValid(userId);

      if (!isUserIdValid) {
        return invalidIdResponse();
      }

      const transactions = await this.getTransactionsByUserIdUseCase.execute({
        userId
      });

      return success(transactions);
    } catch (error) {
      console.error(error);

      if (error instanceof UserNotFoundError) {
        return userNotFoundResponse();
      }

      return internalServerError();
    }
  }
}
