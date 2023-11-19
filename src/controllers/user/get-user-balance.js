import { UserNotFoundError } from "../../errors/user.js";
import {
  checkIfIdIsValid,
  internalServerError,
  invalidIdResponse,
  success,
  userNotFoundResponse
} from "../helpers.js";

export class GetUserBalanceController {
  constructor(getUserBalanceUseCase) {
    this.getUserBalanceUseCase = getUserBalanceUseCase;
  }

  async getUserBalance(httpRequest) {
    const userId = httpRequest.params.userId;

    try {
      const isUUID = checkIfIdIsValid(userId);

      if (!isUUID) {
        return invalidIdResponse();
      }

      const userBalance =
        await this.getUserBalanceUseCase.getUserBalance(userId);

      return success({
        message: "User balance found successfully.",
        response: userBalance
      });
    } catch (error) {
      console.log(error);

      if (error instanceof UserNotFoundError) {
        return userNotFoundResponse();
      }
      return internalServerError();
    }
  }
}
