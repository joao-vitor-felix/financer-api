import { IDeleteUserController, IDeleteUserUseCase } from "@/types";
import { UserNotFoundError } from "@/errors/user";
import {
  checkIfIdIsValid,
  invalidIdResponse,
  success,
  notFound,
  internalServerError
} from "@/controllers/helpers";
import { Request } from "express";

export class DeleteUserController implements IDeleteUserController {
  constructor(private deleteUserUseCase: IDeleteUserUseCase) {}

  async deleteUser(httpRequest: Request) {
    try {
      const userId: string = httpRequest.params.userId;

      const isIdValid = checkIfIdIsValid(userId);

      if (!isIdValid) {
        return invalidIdResponse();
      }

      const response = await this.deleteUserUseCase.deleteUser(userId);

      if (response === null) {
        return notFound("User not found");
      }

      return success({ data: null });
    } catch (error) {
      console.log(error);
      if (error instanceof UserNotFoundError) {
        return notFound(error.message);
      }
      return internalServerError();
    }
  }
}
