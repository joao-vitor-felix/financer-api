import { prisma } from "@/lib/client";
import { IDeleteTransactionRepository } from "@/types";

export class PostgresDeleteTransactionRepository
  implements IDeleteTransactionRepository
{
  async execute(transactionId: string) {
    try {
      await prisma.transaction.delete({
        where: {
          id: transactionId
        }
      });
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
}
