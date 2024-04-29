import { prisma } from "../../../../prisma/client.js";

export class PostgresDeleteTransactionRepository {
  async deleteTransaction(transactionId) {
    try {
      const transaction = await prisma.transaction.delete({
        where: {
          id: transactionId
        }
      });

      return transaction;
    } catch (error) {
      return null;
    }
  }
}
