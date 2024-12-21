import { UserNotFoundError } from "@/errors/user";
import {
  IGetUserBalanceRepository,
  IGetUserBalanceUseCase,
  IGetUserByIdRepository
} from "@/types";
export class GetUserBalanceUseCase implements IGetUserBalanceUseCase {
  constructor(
    private getUserBalanceRepository: IGetUserBalanceRepository,
    private getUserByIdRepository: IGetUserByIdRepository
  ) {}

  async getUserBalance(userId: string) {
    const user = await this.getUserByIdRepository.getUserById(userId);

    if (!user) {
      throw new UserNotFoundError(userId);
    }

    const userBalance =
      await this.getUserBalanceRepository.getUserBalance(userId);

    return userBalance;
  }
}
