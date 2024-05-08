import { UpdateTransactionSchema } from "@/schemas";
import { prisma } from "../../../../prisma/client";
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
      return null;
    }
  }
}
