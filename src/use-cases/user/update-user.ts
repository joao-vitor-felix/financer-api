import bcrypt from "bcrypt";
import { EmailAlreadyInUseError, UserNotFoundError } from "@/errors/user";
import {
  IGetUserByEmailRepository,
  IGetUserByIdUseCase,
  IUpdateUserRepository,
  IUpdateUserUseCase,
  UpdateUserParams
} from "@/types";

export class UpdateUserUseCase implements IUpdateUserUseCase {
  constructor(
    private getUserByIdUseCase: IGetUserByIdUseCase,
    private getUserByEmailRepository: IGetUserByEmailRepository,
    private updateUserRepository: IUpdateUserRepository
  ) {}

  async updateUser(userId: string, updateUserParams: UpdateUserParams) {
    const userReturned = await this.getUserByIdUseCase.getUserById(userId);

    if (!userReturned) {
      throw new UserNotFoundError(userId);
    }

    if (updateUserParams.email) {
      const userWithProvidedEmail =
        await this.getUserByEmailRepository.getUserByEmail(
          updateUserParams.email
        );
      if (userWithProvidedEmail && userWithProvidedEmail.id !== userId) {
        throw new EmailAlreadyInUseError(updateUserParams.email);
      }
    }

    const user = updateUserParams;

    if (updateUserParams.password) {
      const hashedPassword = await bcrypt.hash(updateUserParams.password, 10);
      user.password = hashedPassword;
    }

    const updatedUser = await this.updateUserRepository.updateUser(
      userId,
      user
    );
    return updatedUser;
  }
}
