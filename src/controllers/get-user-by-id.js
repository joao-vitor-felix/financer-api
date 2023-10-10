import { GetUserByIdUseCase } from "../use-cases/index.js";
import {
  checkIfIdIsValid,
  invalidIdResponse,
  internalServerError,
  notFound,
  success
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
        return notFound({ message: "User not found." });
      }

      return success({
        message: "User found successfully.",
        response: userReturned
      });
    } catch (error) {
      console.log(error);
      return internalServerError();
    }
  }
}
