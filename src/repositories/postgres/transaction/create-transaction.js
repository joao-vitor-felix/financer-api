import { prisma } from "../../../../prisma/client.js";

export class PostgresCreateTransactionRepository {
  async createTransaction(createTransactionParams) {
    const transaction = await prisma.transaction.create({
      data: createTransactionParams
    });

    return transaction;
  }
}
