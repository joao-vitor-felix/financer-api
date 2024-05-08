import { Request } from "express";
import { ZodError } from "zod";

import {
  badRequest,
  created,
  internalServerError
} from "@/controllers/helpers";
import { EmailAlreadyInUseError } from "@/errors/user";
import { CreateUserSchema, createUserSchema } from "@/schemas";
import { ICreateUserController, ICreateUserUseCase } from "@/types";

export class CreateUserController implements ICreateUserController {
  constructor(private createUserUseCase: ICreateUserUseCase) {}

  async createUser(httpRequest: Request) {
    try {
      const params: CreateUserSchema = httpRequest.body;

      createUserSchema.parse(params);

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
      if (error instanceof ZodError) {
        return badRequest(error.errors[0].message);
      }

      if (error instanceof EmailAlreadyInUseError) {
        return badRequest(error.message);
      }

      console.log(error);
      return internalServerError();
    }
  }
}
