import { UserNotFoundError } from "@/errors/user";
import {
  IDeleteUserRepository,
  IDeleteUserUseCase,
  IGetUserByIdUseCase
} from "@/types";

export class DeleteUserUseCase implements IDeleteUserUseCase {
  constructor(
    private deleteUserRepository: IDeleteUserRepository,
    private getUserByIdUseCase: IGetUserByIdUseCase
  ) {}

  async deleteUser(id: string) {
    const user = await this.getUserByIdUseCase.getUserById(id);

    if (!user) {
      throw new UserNotFoundError(id);
    }

    const userDeleted = await this.deleteUserRepository.deleteUser(id);

    return userDeleted;
  }
}
