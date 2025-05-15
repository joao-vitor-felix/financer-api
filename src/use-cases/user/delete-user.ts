import { UserNotFoundError } from "@/errors/user";
import { IDeleteUserRepository, IGetUserByIdRepository } from "@/types";

export class DeleteUserUseCase {
  constructor(
    private deleteUserRepository: IDeleteUserRepository,
    private getUserByIdRepository: IGetUserByIdRepository
  ) {}

  async execute(id: string) {
    const user = await this.getUserByIdRepository.execute(id);

    if (!user) {
      throw new UserNotFoundError(id);
    }

    await this.deleteUserRepository.deleteUser(id);
  }
}
