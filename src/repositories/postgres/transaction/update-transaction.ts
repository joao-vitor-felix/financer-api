import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

import { TransactionNotFoundError } from "@/errors";
import { prisma } from "@/lib/client";
import { UpdateTransactionSchema } from "@/schemas";
import { IUpdateTransactionRepository } from "@/types";

export class PostgresUpdateTransactionRepository
  implements IUpdateTransactionRepository
{
  async execute(transactionId: string, params: UpdateTransactionSchema) {
    try {
      const transaction = await prisma.transaction.update({
        where: {
          id: transactionId
        },
        data: params
      });

      return transaction;
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        throw new TransactionNotFoundError();
      }
      console.error(error);
      throw new Error("Error updating transaction");
    }
  }
}
