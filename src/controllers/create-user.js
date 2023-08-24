import validator from "validator";
import { CreateUserUseCase } from "../use-cases/create-user.js";
import { badRequest, created, internalServerError } from "./helpers.js";

export class CreateUserController {
  async createUser(httpRequest) {
    try {
      const { body } = httpRequest;
      const requiredFields = ["first_name", "last_name", "email", "password"];

      for (const field of requiredFields) {
        if (!body[field] || body[field].trim().length === 0) {
          return badRequest({ message: `Missing param: ${field}.` });
        }
      }

      const isValidPassword = body.password.length < 6;

      if (isValidPassword) {
        return badRequest({
          message: "Password must be at least 6 characters."
        });
      }

      const isEmailValid = validator.isEmail(body.email);
      if (!isEmailValid) {
        return badRequest({ message: "Invalid email." });
      }

      const { first_name, last_name, email, password } = body;
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
      return internalServerError();
    }
  }
}
