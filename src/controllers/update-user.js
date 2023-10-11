import {
  badRequest,
  internalServerError,
  notFound,
  success,
  checkIfIdIsValid,
  invalidEmailResponse,
  invalidIdResponse,
  checkIfEmailIsValid,
  checkIfPasswordIsValid,
  invalidPasswordResponse
} from "./helpers/index.js";
import { UpdateUserUseCase } from "../use-cases/index.js";
import { EmailAlreadyInUseError, UserNotFoundError } from "../errors/user.js";

export class UpdateUserController {
  async updateUser(httpRequest) {
    try {
      const userId = httpRequest.params.userId;

      const params = httpRequest.body;

      const isUUID = checkIfIdIsValid(userId);

      if (!isUUID) {
        return invalidIdResponse();
      }

      const allowedFields = ["first_name", "last_name", "email", "password"];

      const someFieldIsNotAllowed = Object.keys(params).some(
        field => !allowedFields.includes(field)
      );

      if (someFieldIsNotAllowed) {
        return badRequest({
          message: "Invalid field provided."
        });
      }

      if (params.email) {
        const isEmailValid = checkIfEmailIsValid(params.email);
        if (!isEmailValid) {
          return invalidEmailResponse();
        }
      }

      if (params.password) {
        const isValidPassword = checkIfPasswordIsValid(params.password);

        if (!isValidPassword) {
          return invalidPasswordResponse();
        }
      }

      const updateUserUseCase = new UpdateUserUseCase();
      const updatedUser = await updateUserUseCase.updateUser(userId, params);

      return success({
        message: "User updated successfully.",
        response: updatedUser
      });
    } catch (error) {
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
