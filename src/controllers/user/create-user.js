import { badRequest, created, internalServerError } from "../helpers/index.js";
import { EmailAlreadyInUseError } from "../../errors/user.js";
import { createUserSchema } from "../../schemas/index.js";
import { ZodError } from "zod";

export class CreateUserController {
  constructor(createUserUseCase) {
    this.createUserUseCase = createUserUseCase;
  }
  async createUser(httpRequest) {
    try {
      const params = httpRequest.body;

      await createUserSchema.parseAsync(params);

      const { firstName, lastName, email, password } = params;

      const userReturned = await this.createUserUseCase.createUser({
        firstName,
        lastName,
        email,
        password
      });

      return created({
        message: "User created successfully.",
        response: userReturned
      });
    } catch (error) {
      console.log(error);

      if (error instanceof ZodError) {
        return badRequest({ message: error.errors[0].message });
      }

      if (error instanceof EmailAlreadyInUseError) {
        return badRequest({ message: error.message });
      }
      return internalServerError();
    }
  }
}
