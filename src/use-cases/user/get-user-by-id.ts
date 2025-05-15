import { UserNotFoundError } from "@/errors/user";
import { IGetUserByIdRepository } from "@/types";

export class GetUserByIdUseCase {
  constructor(private getUserByIdRepository: IGetUserByIdRepository) {}

  async execute(id: string) {
    const user = await this.getUserByIdRepository.execute(id);

    if (!user) {
      throw new UserNotFoundError(id);
    }

    return user;
  }
}
