import { prisma } from "../../../../prisma/client.js";

export class PostgresUpdateTransactionRepository {
  async updateTransaction(transactionId, updateTransactionParams) {
    try {
      const transaction = await prisma.transaction.update({
        where: {
          id: transactionId
        },
        data: updateTransactionParams
      });

      return transaction;
    } catch (error) {
      return null;
    }
  }
}
