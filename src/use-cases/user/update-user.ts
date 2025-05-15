import { PasswordHasherAdapter } from "@/adapters";
import { EmailAlreadyInUseError, UserNotFoundError } from "@/errors/user";
import { UpdateUserSchema } from "@/schemas";
import {
  IGetUserByEmailRepository,
  IGetUserByIdRepository,
  IUpdateUserRepository
} from "@/types";

export class UpdateUserUseCase {
  constructor(
    private getUserByIdRepository: IGetUserByIdRepository,
    private getUserByEmailRepository: IGetUserByEmailRepository,
    private updateUserRepository: IUpdateUserRepository,
    private passwordHasherAdapter: PasswordHasherAdapter
  ) {}

  async execute(userId: string, params: UpdateUserSchema) {
    const userFound = await this.getUserByIdRepository.execute(userId);

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
