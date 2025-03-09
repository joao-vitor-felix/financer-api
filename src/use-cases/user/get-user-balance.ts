import { UserNotFoundError } from "@/errors/user";
import { IGetUserBalanceRepository, IGetUserByIdRepository } from "@/types";
export class GetUserBalanceUseCase {
  constructor(
    private getUserBalanceRepository: IGetUserBalanceRepository,
    private getUserByIdRepository: IGetUserByIdRepository
  ) {}

  async execute(userId: string) {
    const user = await this.getUserByIdRepository.getUserById(userId);

    if (!user) {
      throw new UserNotFoundError(userId);
    }

    const userBalance =
      await this.getUserBalanceRepository.getUserBalance(userId);

    return userBalance;
  }
}
