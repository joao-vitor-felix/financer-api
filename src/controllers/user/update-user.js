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
import { updateUserSchema } from "../../schemas/index.js";
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

      const validation = updateUserSchema.safeParse(params);

      if (!validation.success) {
        return badRequest({ message: "Some provided field is invalid" });
      }

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
