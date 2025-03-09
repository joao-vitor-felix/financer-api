import { prisma } from "@/lib/client";
import { IGetTransactionsByUserIdRepository } from "@/types/transaction.js";

export class PostgresGetTransactionsByUserIdRepository
  implements IGetTransactionsByUserIdRepository
{
  async getTransactions(userId: string) {
    const transactions = await prisma.transaction.findMany({
      where: {
        userId
      }
    });

    return transactions;
  }
}
