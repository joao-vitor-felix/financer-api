import bcrypt from "bcryptjs";

import { EmailAlreadyInUseError, UserNotFoundError } from "@/errors/user";
import { UpdateUserSchema } from "@/schemas";
import { IGetUserByEmailRepository, IUpdateUserRepository } from "@/types";

import { GetUserByIdUseCase } from "./get-user-by-id";

export class UpdateUserUseCase {
  constructor(
    private getUserByIdUseCase: GetUserByIdUseCase,
    private getUserByEmailRepository: IGetUserByEmailRepository,
    private updateUserRepository: IUpdateUserRepository
  ) {}

  async updateUser(userId: string, params: UpdateUserSchema) {
    const userReturned = await this.getUserByIdUseCase.execute(userId);

    if (!userReturned) {
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
