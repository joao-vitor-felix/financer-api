import { Request } from "express";

import {
  checkIfIdIsValid,
  internalServerError,
  invalidIdResponse,
  notFound,
  success
} from "@/controllers/helpers";
import { UserNotFoundError } from "@/errors/user";
import { DeleteUserUseCase } from "@/use-cases";

export class DeleteUserController {
  constructor(private deleteUserUseCase: DeleteUserUseCase) {}

  async deleteUser(httpRequest: Request) {
    try {
      const userId = httpRequest.params.userId;
      const isUUID = checkIfIdIsValid(userId);

      if (!isUUID) {
        return invalidIdResponse();
      }

      await this.deleteUserUseCase.deleteUser(userId);
      return success({ data: null });
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        return notFound(error.message);
      }
      return internalServerError();
    }
  }
}
