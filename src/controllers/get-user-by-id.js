import { GetUserByIdUseCase } from "../use-cases/get-user-by-id.js";
import { badRequest, internalServerError, success } from "./helpers.js";
import validator from "validator";

export class GetUserByIdController {
  async getUserById(httpRequest) {
    try {
      const isUUID = validator.isUUID(httpRequest.params.id);

      if (!isUUID) {
        return badRequest({ message: "Invalid ID." });
      }

      const getUserByIdUseCase = new GetUserByIdUseCase();

      const userReturned = await getUserByIdUseCase.getUserById(
        httpRequest.params.id
      );

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
