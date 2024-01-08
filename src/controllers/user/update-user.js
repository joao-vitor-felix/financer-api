import {
  badRequest,
  internalServerError,
  notFound,
  success,
  checkIfIdIsValid,
  invalidIdResponse
} from "../helpers/index.js";
import {
  EmailAlreadyInUseError,
  UserNotFoundError
} from "../../errors/user.js";
import { updateUserSchema } from "../../schemas/user.js";
import { ZodError } from "zod";

export class UpdateUserController {
  constructor(updateUserUseCase) {
    this.updateUserUseCase = updateUserUseCase;
  }
  async updateUser(httpRequest) {
    try {
      const userId = httpRequest.params.userId;

      const params = httpRequest.body;

      const isUUID = checkIfIdIsValid(userId);

      if (!isUUID) {
        return invalidIdResponse();
      }

      await updateUserSchema.parseAsync(params);

      const updatedUser = await this.updateUserUseCase.updateUser(
        userId,
        params
      );

      return success({
        message: "User updated successfully.",
        response: updatedUser
      });
    } catch (error) {
      if (error instanceof ZodError) {
        return badRequest({
          message: error.errors[0].message
        });
      }

      if (error instanceof EmailAlreadyInUseError) {
        return badRequest({ message: error.message });
      }

      if (error instanceof UserNotFoundError) {
        return notFound({ message: error.message });
      }

      console.error(error);
      return internalServerError();
    }
  }
}
