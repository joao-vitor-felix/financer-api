import { Request } from "express";
import { ZodError } from "zod";

import {
  badRequest,
  created,
  internalServerError
} from "@/controllers/helpers";
import { EmailAlreadyInUseError } from "@/errors/user";
import { CreateUserSchema, createUserSchema } from "@/schemas";
import { CreateUserUseCase } from "@/use-cases";

export class CreateUserController {
  constructor(private createUserUseCase: CreateUserUseCase) {}

  async execute(httpRequest: Request) {
    try {
      const params: CreateUserSchema = httpRequest.body;
      createUserSchema.parse(params);

      const { firstName, lastName, email, password } = params;
      const user = await this.createUserUseCase.execute({
        firstName,
        lastName,
        email,
        password
      });

      return created(user);
    } catch (error) {
      if (error instanceof ZodError) {
        return badRequest(error.errors[0]?.message);
      }

      if (error instanceof EmailAlreadyInUseError) {
        return badRequest(error.message);
      }

      console.error(error);
      return internalServerError();
    }
  }
}
