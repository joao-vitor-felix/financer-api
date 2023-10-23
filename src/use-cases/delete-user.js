import { UserNotFoundError } from "../errors/user.js";

export class DeleteUserUseCase {
  constructor(deleteUserRepository, getUserByIdUseCase) {
    this.deleteUserRepository = deleteUserRepository;
    this.getUserByIdUseCase = getUserByIdUseCase;
  }

  async deleteUser(id) {
    const user = await this.getUserByIdUseCase.getUserById(id);

    if (!user) {
      throw new UserNotFoundError(id);
    }

    const userDeleted = await this.deleteUserRepository.deleteUser(id);

    return userDeleted;
  }
}
