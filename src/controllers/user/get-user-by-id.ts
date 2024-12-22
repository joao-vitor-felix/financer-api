import { Request } from "express";

import {
  checkIfIdIsValid,
  internalServerError,
  invalidIdResponse,
  success,
  userNotFoundResponse
} from "@/controllers/helpers";
import { GetUserByIdUseCase } from "@/use-cases";

export class GetUserByIdController {
  constructor(private getUserByIdUseCase: GetUserByIdUseCase) {}

  async getUserById(httpRequest: Request) {
    const userId = httpRequest.params.userId;
    try {
      const isUUID = checkIfIdIsValid(userId);
      if (!isUUID) {
        return invalidIdResponse();
      }

      const userReturned = await this.getUserByIdUseCase.getUserById(userId);
      if (!userReturned) {
        return userNotFoundResponse();
      }

      return success({
        data: userReturned
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_error) {
      return internalServerError();
    }
  }
}
