import { badRequest, created, internalServerError } from "../helpers/index";
import { EmailAlreadyInUseError } from "@/errors/user";
import { createUserSchema } from "@/schemas/index";
import { ZodError } from "zod";
import { Request } from "express";
import {
  CreateUserParams,
  ICreateUserController,
  ICreateUserUseCase
} from "@/types";

export class CreateUserController implements ICreateUserController {
  constructor(private createUserUseCase: ICreateUserUseCase) {}

  async createUser(httpRequest: Request) {
    try {
      const params: CreateUserParams = httpRequest.body;

      const validation = createUserSchema.safeParse(params);

      if (!validation.success) {
        return badRequest("Some provided field is invalid");
      }

      const { firstName, lastName, email, password } = params;

      const user = await this.createUserUseCase.createUser({
        firstName,
        lastName,
        email,
        password
      });

      return created({
        data: user
      });
    } catch (error) {
      console.log(error);

      if (error instanceof ZodError) {
        return badRequest(error.errors[0].message);
      }

      if (error instanceof EmailAlreadyInUseError) {
        return badRequest(error.message);
      }
      return internalServerError();
    }
  }
}
