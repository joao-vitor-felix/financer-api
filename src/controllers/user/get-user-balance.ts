import { Request } from "express";

import {
  checkIfIdIsValid,
  internalServerError,
  invalidIdResponse,
  success,
  userNotFoundResponse
} from "@/controllers/helpers";
import { UserNotFoundError } from "@/errors/user";
import { IGetUserBalanceController, IGetUserBalanceUseCase } from "@/types";

export class GetUserBalanceController implements IGetUserBalanceController {
  constructor(private getUserBalanceUseCase: IGetUserBalanceUseCase) {}

  async getUserBalance(httpRequest: Request) {
    const userId = httpRequest.params.userId;

    try {
      const isUUID = checkIfIdIsValid(userId);

      if (!isUUID) {
        return invalidIdResponse();
      }

      const userBalance =
        await this.getUserBalanceUseCase.getUserBalance(userId);

      return success({
        data: userBalance
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
