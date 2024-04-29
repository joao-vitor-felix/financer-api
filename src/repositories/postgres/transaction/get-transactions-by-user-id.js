import { prisma } from "../../../../prisma/client.js";

export class PostgresGetTransactionsByUserIdRepository {
  async getTransactions(userId) {
    const transactions = await prisma.transaction.findMany({
      where: {
        userId
      }
    });

    return transactions;
  }
}
