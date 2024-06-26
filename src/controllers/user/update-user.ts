import { Request } from "express";
import { ZodError } from "zod";

import {
  badRequest,
  checkIfIdIsValid,
  internalServerError,
  invalidIdResponse,
  notFound,
  success
} from "@/controllers/helpers";
import { EmailAlreadyInUseError, UserNotFoundError } from "@/errors/user";
import { UpdateUserSchema, updateUserSchema } from "@/schemas";
import { IUpdateUserController, IUpdateUserUseCase } from "@/types";

export class UpdateUserController implements IUpdateUserController {
  constructor(private updateUserUseCase: IUpdateUserUseCase) {}

  async updateUser(httpRequest: Request) {
    try {
      const userId = httpRequest.params.userId;

      const params: UpdateUserSchema = httpRequest.body;

      const isUUID = checkIfIdIsValid(userId);

      if (!isUUID) {
        return invalidIdResponse();
      }

      updateUserSchema.parse(params);

      const updatedUser = await this.updateUserUseCase.updateUser(
        userId,
        params
      );

      return success({
        data: updatedUser
      });
    } catch (error) {
      if (error instanceof ZodError) {
        return badRequest(error.errors[0].message);
      }

      if (error instanceof EmailAlreadyInUseError) {
        return badRequest(error.message);
      }

      if (error instanceof UserNotFoundError) {
        return notFound(error.message);
      }

      console.error(error);
      return internalServerError();
    }
  }
}
