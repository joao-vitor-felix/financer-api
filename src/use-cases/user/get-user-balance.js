import { UserNotFoundError } from "../../errors/user.js";

export class GetUserBalanceUseCase {
  constructor(getUserBalanceRepository, getUserIdRepository) {
    this.getUserBalanceRepository = getUserBalanceRepository;
    this.getUserIdRepository = getUserIdRepository;
  }

  async getUserBalance(userId) {
    const user = await this.getUserIdRepository.getUserId(userId);

    if (!user) {
      throw new UserNotFoundError(userId);
    }

    const userBalance =
      await this.getUserBalanceRepository.getUserBalance(userId);

    return userBalance;
  }
}
