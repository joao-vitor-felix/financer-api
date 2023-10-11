import { UserNotFoundError } from "../errors/user.js";
import { GetUserByIdUseCase } from "../use-cases/index.js";
import {
  checkIfIdIsValid,
  invalidIdResponse,
  internalServerError,
  success,
  notFound
} from "./helpers/index.js";

export class GetUserByIdController {
  async getUserById(httpRequest) {
    const userId = httpRequest.params.userId;

    try {
      const isUUID = checkIfIdIsValid(userId);

      if (!isUUID) {
        return invalidIdResponse();
      }

      const getUserByIdUseCase = new GetUserByIdUseCase();

      const userReturned = await getUserByIdUseCase.getUserById(userId);

      if (!userReturned) {
        throw new UserNotFoundError(userId);
      }

      return success({
        message: "User found successfully.",
        response: userReturned
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
