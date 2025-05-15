import { UserNotFoundError } from "@/errors/user";
import { IGetUserBalanceRepository, IGetUserByIdRepository } from "@/types";

export class GetUserBalanceUseCase {
  constructor(
    private getUserBalanceRepository: IGetUserBalanceRepository,
    private getUserByIdRepository: IGetUserByIdRepository
  ) {}

  async execute(userId: string) {
    const user = await this.getUserByIdRepository.execute(userId);

    if (!user) {
      throw new UserNotFoundError(userId);
    }

    const balance = await this.getUserBalanceRepository.getUserBalance(userId);
    return balance;
  }
}
