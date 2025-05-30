import { Request } from "express";
import { ZodError } from "zod";

import {
  badRequest,
  checkIfIdIsValid,
  conflict,
  internalServerError,
  invalidIdResponse,
  notFound,
  success
} from "@/controllers/helpers";
import { EmailAlreadyInUseError, UserNotFoundError } from "@/errors/user";
import { updateUserSchema } from "@/schemas";
import { UpdateUserUseCase } from "@/use-cases";

export class UpdateUserController {
  constructor(private updateUserUseCase: UpdateUserUseCase) {}

  async execute(httpRequest: Request) {
    try {
      const userId = httpRequest.params.userId;
      const isUUID = checkIfIdIsValid(userId);

      if (!isUUID) {
        return invalidIdResponse();
      }

      const params = updateUserSchema.parse(httpRequest.body);
      const user = await this.updateUserUseCase.execute(userId, params);
      return success(user);
    } catch (error) {
      if (error instanceof ZodError) {
        return badRequest(error.errors[0].message);
      }

      if (error instanceof EmailAlreadyInUseError) {
        return conflict(error.message);
      }

      if (error instanceof UserNotFoundError) {
        return notFound(error.message);
      }

      console.log(error);
      return internalServerError();
    }
  }
}
