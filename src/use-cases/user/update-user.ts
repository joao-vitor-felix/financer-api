import bcrypt from "bcrypt";

import { EmailAlreadyInUseError, UserNotFoundError } from "@/errors/user";
import { UpdateUserSchema } from "@/schemas";
import {
  IGetUserByEmailRepository,
  IGetUserByIdUseCase,
  IUpdateUserRepository,
  IUpdateUserUseCase
} from "@/types";

export class UpdateUserUseCase implements IUpdateUserUseCase {
  constructor(
    private getUserByIdUseCase: IGetUserByIdUseCase,
    private getUserByEmailRepository: IGetUserByEmailRepository,
    private updateUserRepository: IUpdateUserRepository
  ) {}

  async updateUser(userId: string, params: UpdateUserSchema) {
    const userReturned = await this.getUserByIdUseCase.getUserById(userId);

    if (!userReturned) {
      throw new UserNotFoundError(userId);
    }

    if (params.email) {
      const userWithProvidedEmail =
        await this.getUserByEmailRepository.getUserByEmail(params.email);
      if (userWithProvidedEmail && userWithProvidedEmail.id !== userId) {
        throw new EmailAlreadyInUseError(params.email);
      }
    }

    const user = params;

    if (params.password) {
      const hashedPassword = await bcrypt.hash(params.password, 10);
      user.password = hashedPassword;
    }

    const updatedUser = await this.updateUserRepository.updateUser(
      userId,
      user
    );
    return updatedUser;
  }
}
