import bcrypt from "bcrypt";
import { EmailAlreadyInUseError } from "../errors/user.js";
import { PostgresGetUserByEmail } from "../repositories/postgres/get-user-by-email.js";
import { PostgresUpdateUserRepository } from "../repositories/postgres/update-user.js";

export class UpdateUserUseCase {
  async updateUser(userId, updateUserParams) {
    if (updateUserParams.email) {
      const postgresGetUserByEmail = new PostgresGetUserByEmail();
      const isEmailAlreadyInUse = await postgresGetUserByEmail.getUserByEmail(
        updateUserParams.email
      );
      if (isEmailAlreadyInUse) {
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
