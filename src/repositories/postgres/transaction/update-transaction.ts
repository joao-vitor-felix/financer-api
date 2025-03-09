import { prisma } from "@/lib/client";
import { UpdateTransactionSchema } from "@/schemas";
import { IUpdateTransactionRepository } from "@/types";

export class PostgresUpdateTransactionRepository
  implements IUpdateTransactionRepository
{
  async updateTransaction(
    transactionId: string,
    params: UpdateTransactionSchema
  ) {
    try {
      const transaction = await prisma.transaction.update({
        where: {
          id: transactionId
        },
        data: params
      });

      return transaction;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}
