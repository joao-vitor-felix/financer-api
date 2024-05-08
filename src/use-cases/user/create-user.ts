import bcrypt from "bcrypt";

import { EmailAlreadyInUseError } from "@/errors/user";
import { CreateUserSchema } from "@/schemas";
import {
  ICreateUserRepository,
  ICreateUserUseCase,
  IGetUserByEmailRepository
} from "@/types";

export class CreateUserUseCase implements ICreateUserUseCase {
  constructor(
    private getUserByEmailRepository: IGetUserByEmailRepository,
    private createUserRepository: ICreateUserRepository
  ) {}

  async createUser(params: CreateUserSchema) {
    const isEmailAlreadyInUse =
      await this.getUserByEmailRepository.getUserByEmail(params.email);

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

    const createdUser = await this.createUserRepository.createUser(user);
    return createdUser;
  }
}
