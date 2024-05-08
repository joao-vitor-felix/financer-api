import { CreateTransactionSchema } from "@/schemas";
import { prisma } from "../../../../prisma/client";
import { ICreateTransactionRepository } from "@/types";

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
