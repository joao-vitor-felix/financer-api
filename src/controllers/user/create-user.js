import {
  badRequest,
  created,
  internalServerError,
  checkIfPasswordIsValid,
  invalidPasswordResponse,
  checkIfEmailIsValid,
  invalidEmailResponse,
  validateRequiredFields,
  missingFieldResponse
} from "../helpers/index.js";
import { EmailAlreadyInUseError } from "../../errors/user.js";

export class CreateUserController {
  constructor(createUserUseCase) {
    this.createUserUseCase = createUserUseCase;
  }
  async createUser(httpRequest) {
    try {
      const params = httpRequest.body;
      const requiredFields = ["first_name", "last_name", "email", "password"];

      const { ok: isFieldsValid, missingField } = validateRequiredFields(
        params,
        requiredFields
      );

      if (!isFieldsValid) {
        return missingFieldResponse(missingField);
      }

      const isPasswordValid = checkIfPasswordIsValid(params.password);

      if (!isPasswordValid) {
        return invalidPasswordResponse();
      }

      const isEmailValid = checkIfEmailIsValid(params.email);

      if (!isEmailValid) {
        return invalidEmailResponse();
      }

      const { first_name, last_name, email, password } = params;

      const userReturned = await this.createUserUseCase.createUser({
        first_name,
        last_name,
        email,
        password
      });

      return created({
        message: "User created successfully.",
        response: userReturned
      });
    } catch (error) {
      console.log(error);
      if (error instanceof EmailAlreadyInUseError) {
        return badRequest({ message: error.message });
      }
      return internalServerError();
    }
  }
}
