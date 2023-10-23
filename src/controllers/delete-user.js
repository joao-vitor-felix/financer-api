import { UserNotFoundError } from "../errors/user.js";
import {
  checkIfIdIsValid,
  invalidIdResponse,
  success,
  notFound,
  internalServerError
} from "./helpers/index.js";

export class DeleteUserController {
  constructor(deleteUserUseCase) {
    this.deleteUserUseCase = deleteUserUseCase;
  }

  async deleteUser(httpRequest) {
    try {
      const userId = httpRequest.params.userId;

      const isIdValid = checkIfIdIsValid(userId);

      if (!isIdValid) {
        return invalidIdResponse();
      }

      const userDeleted = await this.deleteUserUseCase.deleteUser(userId);

      return success({
        message: "User deleted successfully.",
        response: userDeleted
      });
    } catch (error) {
      console.log(error);
      if (error instanceof UserNotFoundError) {
        return notFound({ message: error.message });
      }
      return internalServerError();
    }
  }
}
