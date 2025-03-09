import bcrypt from "bcryptjs";

import { EmailAlreadyInUseError } from "@/errors/user";
import { CreateUserSchema } from "@/schemas";
import { ICreateUserRepository, IGetUserByEmailRepository } from "@/types";

export class CreateUserUseCase {
  constructor(
    private getUserByEmailRepository: IGetUserByEmailRepository,
    private createUserRepository: ICreateUserRepository
  ) {}

  async execute(params: CreateUserSchema) {
    const isEmailAlreadyInUse = await this.getUserByEmailRepository.execute(
      params.email
    );

    if (isEmailAlreadyInUse) {
      throw new EmailAlreadyInUseError(params.email);
    }

    const { firstName, lastName, email } = params;

    const hashedPassword = await bcrypt.hash(params.password, 10);
    const user = {
      firstName,
      lastName,
      email,
      password: hashedPassword
    };

    const createdUser = await this.createUserRepository.execute(user);
    return createdUser;
  }
}
