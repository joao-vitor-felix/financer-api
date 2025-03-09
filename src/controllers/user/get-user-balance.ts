import { Request } from "express";

import {
  checkIfIdIsValid,
  internalServerError,
  invalidIdResponse,
  success,
  userNotFoundResponse
} from "@/controllers/helpers";
import { UserNotFoundError } from "@/errors/user";
import { GetUserBalanceUseCase } from "@/use-cases";

export class GetUserBalanceController {
  constructor(private getUserBalanceUseCase: GetUserBalanceUseCase) {}

  async execute(httpRequest: Request) {
    const userId = httpRequest.params.userId;
    try {
      const isUUID = checkIfIdIsValid(userId);
      if (!isUUID) {
        return invalidIdResponse();
      }
      const userBalance = await this.getUserBalanceUseCase.execute(userId);
      return success({
        data: userBalance
      });
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        return userNotFoundResponse();
      }
      return internalServerError();
    }
  }
}
