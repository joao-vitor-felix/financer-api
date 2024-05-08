import { IDeleteTransactionRepository } from "@/types";
import { prisma } from "../../../../prisma/client";

export class PostgresDeleteTransactionRepository
  implements IDeleteTransactionRepository
{
  async deleteTransaction(transactionId: string) {
    try {
      await prisma.transaction.delete({
        where: {
          id: transactionId
        }
      });
    } catch (error) {
      return null;
    }
  }
}
