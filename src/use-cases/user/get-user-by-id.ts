import { IGetUserByIdRepository } from "@/types";

export class GetUserByIdUseCase {
  constructor(private getUserByIdRepository: IGetUserByIdRepository) {}

  async execute(id: string) {
    const userReturned = await this.getUserByIdRepository.getUserById(id);
    return userReturned;
  }
}
