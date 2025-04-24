import { PasswordHasherAdapter } from "@/adapters";
import { EmailAlreadyInUseError, UserNotFoundError } from "@/errors/user";
import { UpdateUserSchema } from "@/schemas";
import { IGetUserByEmailRepository, IUpdateUserRepository } from "@/types";

import { GetUserByIdUseCase } from "./get-user-by-id";

export class UpdateUserUseCase {
  constructor(
    private getUserByIdUseCase: GetUserByIdUseCase,
    private getUserByEmailRepository: IGetUserByEmailRepository,
    private updateUserRepository: IUpdateUserRepository,
    private passwordHasherAdapter: PasswordHasherAdapter
  ) {}

  async execute(userId: string, params: UpdateUserSchema) {
    const userFound = await this.getUserByIdUseCase.execute(userId);

    if (!userFound) {
      throw new UserNotFoundError(userId);
    }

    if (params.email) {
      const userWithProvidedEmail = await this.getUserByEmailRepository.execute(
        params.email
      );

      if (userWithProvidedEmail && userWithProvidedEmail.id !== userId) {
        throw new EmailAlreadyInUseError(params.email);
      }
    }

    if (params.password) {
      params.password = await this.passwordHasherAdapter.hash(params.password);
    }

    const user = await this.updateUserRepository.updateUser(userId, params);
    return user;
  }
}
