import { CreateTransactionSchema } from "@/schemas";
import { ICreateTransactionRepository } from "@/types";

import { prisma } from "../../../../prisma/client";

export class PostgresCreateTransactionRepository
  implements ICreateTransactionRepository
{
  async createTransaction(params: CreateTransactionSchema) {
    const transaction = await prisma.transaction.create({
      data: params
    });

    return transaction;
  }
}
