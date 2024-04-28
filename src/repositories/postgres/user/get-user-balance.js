import { prisma } from "../../../../prisma/client.js";
import { computeBalanceByType } from "../../../helpers/index.js";
export class PostgresGetUserBalanceRepository {
  async getUserBalance(userId) {
    const userTransactions = await prisma.transaction.findMany({
      where: {
        userId: userId
      }
    });

    const transactions = computeBalanceByType(userTransactions);

    return transactions;
  }
}
