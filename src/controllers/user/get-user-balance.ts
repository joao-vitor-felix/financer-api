import { UserNotFoundError } from "@/errors/user";
import {
  checkIfIdIsValid,
  internalServerError,
  invalidIdResponse,
  success,
  userNotFoundResponse
} from "@/controllers/helpers";
import { IGetUserBalanceController, IGetUserBalanceUseCase } from "@/types";
import { Request } from "express";

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
      console.log(error);

      if (error instanceof UserNotFoundError) {
        return userNotFoundResponse();
      }

      return internalServerError();
    }
  }
}
