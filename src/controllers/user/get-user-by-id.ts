import { UserNotFoundError } from "@/errors/user";
import {
  checkIfIdIsValid,
  invalidIdResponse,
  internalServerError,
  success,
  userNotFoundResponse
} from "@/controllers/helpers";
import { IGetUserByIdController, IGetUserByIdUseCase } from "@/types";
import { Request } from "express";

export class GetUserByIdController implements IGetUserByIdController {
  constructor(private getUserByIdUseCase: IGetUserByIdUseCase) {}
  async getUserById(httpRequest: Request) {
    const userId = httpRequest.params.userId;

    try {
      const isUUID = checkIfIdIsValid(userId);

      if (!isUUID) {
        return invalidIdResponse();
      }

      const userReturned = await this.getUserByIdUseCase.getUserById(userId);

      if (!userReturned) {
        throw new UserNotFoundError(userId);
      }

      return success({
        data: userReturned
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
