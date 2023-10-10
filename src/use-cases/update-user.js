import bcrypt from "bcrypt";
import { EmailAlreadyInUseError, UserNotFoundError } from "../errors/user.js";
import {
  PostgresGetUserByEmail,
  PostgresUpdateUserRepository
} from "../repositories/postgres/index.js";
import { GetUserByIdUseCase } from "../use-cases/index.js";

export class UpdateUserUseCase {
  async updateUser(userId, updateUserParams) {
    const getUserByIdUseCase = new GetUserByIdUseCase();

    const userReturned = await getUserByIdUseCase.getUserById(userId);

    if (!userReturned) {
      throw new UserNotFoundError(userId);
    }

    if (updateUserParams.email) {
      const postgresGetUserByEmail = new PostgresGetUserByEmail();
      const userWithProvidedEmail = await postgresGetUserByEmail.getUserByEmail(
        updateUserParams.email
      );
      if (userWithProvidedEmail && userWithProvidedEmail.id !== userId) {
        throw new EmailAlreadyInUseError(updateUserParams.email);
      }
    }

    const user = { ...updateUserParams };

    if (updateUserParams.password) {
      const hashedPassword = await bcrypt.hash(updateUserParams.password, 10);
      user.password = hashedPassword;
    }

    const postgresUpdateUserUseCase = new PostgresUpdateUserRepository();
    const updatedUser = await postgresUpdateUserUseCase.updateUser(
      userId,
      user
    );
    return updatedUser;
  }
}
