import { Request } from "express";

import {
  checkIfIdIsValid,
  internalServerError,
  invalidIdResponse,
  notFound,
  success
} from "@/controllers/helpers";
import { UserNotFoundError } from "@/errors/user";
import { IDeleteUserController, IDeleteUserUseCase } from "@/types";

export class DeleteUserController implements IDeleteUserController {
  constructor(private deleteUserUseCase: IDeleteUserUseCase) {}

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

      console.error(error);
      return internalServerError();
    }
  }
}
