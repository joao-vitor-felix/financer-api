import { UserNotFoundError } from "../errors/user.js";
import {
  checkIfIdIsValid,
  invalidIdResponse,
  internalServerError,
  success,
  notFound
} from "./helpers/index.js";

export class GetUserByIdController {
  constructor(getUserByIdUseCase) {
    this.getUserByIdUseCase = getUserByIdUseCase;
  }
  async getUserById(httpRequest) {
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
