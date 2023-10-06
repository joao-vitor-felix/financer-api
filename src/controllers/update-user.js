import validator from "validator";
import {
  badRequest,
  internalServerError,
  notFound,
  success
} from "./helpers.js";
import { UpdateUserUseCase } from "../use-cases/update-user.js";
import { GetUserByIdUseCase } from "../use-cases/get-user-by-id.js";
import { EmailAlreadyInUseError } from "../errors/user.js";

export class UpdateUserController {
  async updateUser(httpRequest) {
    try {
      const userId = httpRequest.params.userId;

      const updateUserParams = httpRequest.body;

      const isUUID = validator.isUUID(userId);

      if (!isUUID) {
        return badRequest({ message: "Invalid ID." });
      }

      const getUserByIdUseCase = new GetUserByIdUseCase();

      const userReturned = await getUserByIdUseCase.getUserById(userId);

      if (!userReturned) {
        return notFound({ message: "User not found." });
      }

      const allowedFields = ["first_name", "last_name", "email", "password"];

      const someFieldIsNotAllowed = Object.keys(updateUserParams).some(
        field => !allowedFields.includes(field)
      );

      if (someFieldIsNotAllowed) {
        return badRequest({
          message: "Invalid field provided."
        });
      }

      if (updateUserParams.email) {
        const isEmailValid = validator.isEmail(updateUserParams.email);
        if (!isEmailValid) {
          return badRequest({ message: "Invalid email." });
        }
      }

      if (updateUserParams.password) {
        const isValidPassword = updateUserParams.password.length < 6;

        if (isValidPassword) {
          return badRequest({
            message: "Password must be at least 6 characters."
          });
        }
      }

      const updateUserUseCase = new UpdateUserUseCase();
      const updatedUser = await updateUserUseCase.updateUser(
        userId,
        updateUserParams
      );

      return success({
        message: "User updated successfully.",
        response: updatedUser
      });
    } catch (error) {
      if (error instanceof EmailAlreadyInUseError) {
        return badRequest({ message: error.message });
      }

      console.error(error);
      return internalServerError();
    }
  }
}
