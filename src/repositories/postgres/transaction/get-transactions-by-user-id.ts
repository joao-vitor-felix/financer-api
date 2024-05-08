import { IGetTransactionsByUserIdRepository } from "@/types/transaction.js";
import { prisma } from "../../../../prisma/client";

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
