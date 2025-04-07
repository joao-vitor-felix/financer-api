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
    try {
      const userId = httpRequest.params.userId;
      const isUUID = checkIfIdIsValid(userId);

      if (!isUUID) {
        return invalidIdResponse();
      }

      const balance = await this.getUserBalanceUseCase.execute(userId);
      return success(balance);
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        return userNotFoundResponse();
      }

      console.error(error);
      return internalServerError();
    }
  }
}
