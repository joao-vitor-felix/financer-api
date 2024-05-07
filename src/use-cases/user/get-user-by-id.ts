import { IGetUserByIdRepository, IGetUserByIdUseCase } from "@/types";

export class GetUserByIdUseCase implements IGetUserByIdUseCase {
  constructor(private getUserByIdRepository: IGetUserByIdRepository) {}
  async getUserById(id: string) {
    const userReturned = await this.getUserByIdRepository.getUserById(id);

    return userReturned;
  }
}
