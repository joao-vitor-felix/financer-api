import { CreateUserUseCase } from "../use-cases/create-user.js";

export class CreateUserController {
  async createUser(httpRequest) {
    try {
      const { body } = httpRequest;
      const { first_name, last_name, email, password } = body;
      const requiredFields = ["first_name", "last_name", "email", "password"];

      for (const field of requiredFields) {
        if (!body[field] || body[field].trim().length === 0) {
          return {
            statusCode: 400,
            body: {
              message: `Missing param: ${field}`
            }
          };
        }
      }

      const createUserUseCase = new CreateUserUseCase();
      const userReturned = await createUserUseCase.createUser({
        first_name,
        last_name,
        email,
        password
      });

      return {
        statusCode: 201,
        body: {
          message: "User created successfully",
          response: userReturned
        }
      };
    } catch (error) {
      console.log(error);
      return {
        statusCode: 500,
        body: {
          message: "Internal server error"
        }
      };
    }
  }
}
