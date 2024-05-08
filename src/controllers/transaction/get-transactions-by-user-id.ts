import { Request } from "express";

import {
  checkIfIdIsValid,
  internalServerError,
  invalidIdResponse,
  missingFieldResponse,
  success,
  userNotFoundResponse
} from "@/controllers/helpers";
import { UserNotFoundError } from "@/errors/user";
import {
  IGetTransactionsByUserIdController,
  IGetTransactionsByUserIdUseCase
} from "@/types";

export class GetTransactionsByUserIdController
  implements IGetTransactionsByUserIdController
{
  constructor(
    private getTransactionsByUserIdUseCase: IGetTransactionsByUserIdUseCase
  ) {}

  async getTransactions(httpRequest: Request) {
    try {
      const userId = httpRequest.query.userId as string;

      if (!userId) {
        return missingFieldResponse("userId");
      }

      const isUUID = checkIfIdIsValid(userId);

      if (!isUUID) {
        return invalidIdResponse();
      }

      const transactions =
        await this.getTransactionsByUserIdUseCase.getTransactions(userId);

      return success({
        data: transactions
      });
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        return userNotFoundResponse();
      }

      console.error(error);
      return internalServerError();
    }
  }
}
