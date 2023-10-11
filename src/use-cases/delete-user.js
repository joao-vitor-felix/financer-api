import { UserNotFoundError } from "../errors/user.js";
import { PostgresDeleteUserRepository } from "../repositories/postgres/index.js";
import { GetUserByIdUseCase } from "./index.js";

export class DeleteUserUseCase {
  async deleteUser(id) {
    const getUserByIdUseCase = new GetUserByIdUseCase();
    const user = await getUserByIdUseCase.getUserById(id);

    if (!user) {
      throw new UserNotFoundError(id);
    }

    const postgresDeleteUserRepository = new PostgresDeleteUserRepository();
    const userDeleted = await postgresDeleteUserRepository.deleteUser(id);

    return userDeleted;
  }
}
