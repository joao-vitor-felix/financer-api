import { CreateUserUseCase } from "../use-cases/index.js";
import {
  badRequest,
  created,
  internalServerError,
  checkIfPasswordIsValid,
  invalidPasswordResponse,
  checkIfEmailIsValid,
  invalidEmailResponse
} from "./helpers/index.js";
import { EmailAlreadyInUseError } from "../errors/user.js";

export class CreateUserController {
  async createUser(httpRequest) {
    try {
      const params = httpRequest.body;
      const requiredFields = ["first_name", "last_name", "email", "password"];

      for (const field of requiredFields) {
        if (!params[field] || params[field].trim().length === 0) {
          return badRequest({ message: `Missing param: ${field}.` });
        }
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
      const createUserUseCase = new CreateUserUseCase();
      const userReturned = await createUserUseCase.createUser({
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
