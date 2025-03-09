import { UserNotFoundError } from "@/errors/user";
import { IDeleteUserRepository } from "@/types";

import { GetUserByIdUseCase } from "./get-user-by-id";

export class DeleteUserUseCase {
  constructor(
    private deleteUserRepository: IDeleteUserRepository,
    private getUserByIdUseCase: GetUserByIdUseCase
  ) {}

  async execute(id: string) {
    const user = await this.getUserByIdUseCase.execute(id);

    if (!user) {
      throw new UserNotFoundError(id);
    }

    const userDeleted = await this.deleteUserRepository.deleteUser(id);
    return userDeleted;
  }
}
