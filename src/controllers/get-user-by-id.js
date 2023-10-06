import { GetUserByIdUseCase } from "../use-cases/get-user-by-id.js";
import {
  badRequest,
  internalServerError,
  notFound,
  success
} from "./helpers.js";
import validator from "validator";

export class GetUserByIdController {
  async getUserById(httpRequest) {
    const userId = httpRequest.params.userId;

    try {
      const isUUID = validator.isUUID(userId);

      if (!isUUID) {
        return badRequest({ message: "Invalid ID." });
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
