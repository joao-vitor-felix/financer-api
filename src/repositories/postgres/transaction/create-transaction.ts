import { prisma } from "@/lib/client";
import { CreateTransactionSchema } from "@/schemas";
import { ICreateTransactionRepository } from "@/types";

export class PostgresCreateTransactionRepository
  implements ICreateTransactionRepository
{
  async execute(params: CreateTransactionSchema) {
    const transaction = await prisma.transaction.create({
      data: params
    });

    return transaction;
  }
}
