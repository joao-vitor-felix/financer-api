import { prisma } from "@/lib/client";
import { IDeleteTransactionRepository } from "@/types";

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
      console.error(error);
      return null;
    }
  }
}
