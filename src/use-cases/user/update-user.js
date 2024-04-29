import bcrypt from "bcrypt";
import {
  EmailAlreadyInUseError,
  UserNotFoundError
} from "../../errors/user.js";

export class UpdateUserUseCase {
  constructor(
    getUserByIdUseCase,
    getUserByEmailRepository,
    updateUserRepository
  ) {
    this.getUserByIdUseCase = getUserByIdUseCase;
    this.getUserByEmailRepository = getUserByEmailRepository;
    this.updateUserRepository = updateUserRepository;
  }
  async updateUser(userId, updateUserParams) {
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
