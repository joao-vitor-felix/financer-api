import { Request } from "express";

import {
  checkIfIdIsValid,
  internalServerError,
  invalidIdResponse,
  notFound,
  success
} from "@/controllers/helpers";
import { UserNotFoundError } from "@/errors/user";
import { GetUserByIdUseCase } from "@/use-cases";

export class GetUserByIdController {
  constructor(private getUserByIdUseCase: GetUserByIdUseCase) {}

  async execute(httpRequest: Request) {
    try {
      const userId = httpRequest.params.userId;
      const isUUID = checkIfIdIsValid(userId);

      if (!isUUID) {
        return invalidIdResponse();
      }

      const user = await this.getUserByIdUseCase.execute(userId);
      return success(user);
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        return notFound(error.message);
      }
      console.error(error);
      return internalServerError();
    }
  }
}
