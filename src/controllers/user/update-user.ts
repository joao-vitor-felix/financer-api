import {
  badRequest,
  internalServerError,
  notFound,
  success,
  checkIfIdIsValid,
  invalidIdResponse
} from "@/controllers/helpers";
import { EmailAlreadyInUseError, UserNotFoundError } from "@/errors/user";
import { updateUserSchema } from "@/schemas";
import { ZodError } from "zod";
import { Request } from "express";
import { IUpdateUserController, IUpdateUserUseCase } from "@/types";

export class UpdateUserController implements IUpdateUserController {
  constructor(private updateUserUseCase: IUpdateUserUseCase) {}
  async updateUser(httpRequest: Request) {
    try {
      const userId = httpRequest.params.userId;

      const params = httpRequest.body;

      const isUUID = checkIfIdIsValid(userId);

      if (!isUUID) {
        return invalidIdResponse();
      }

      const validation = updateUserSchema.safeParse(params);

      if (!validation.success) {
        return badRequest("Some provided field is invalid");
      }

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
