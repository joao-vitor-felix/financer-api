import { Transaction } from "@prisma/client";

import { CreateTransactionSchema, UpdateTransactionSchema } from "@/schemas";

export interface ICreateTransactionRepository {
  execute(transaction: CreateTransactionSchema): Promise<Transaction>;
}

export interface IUpdateTransactionRepository {
  execute(
    transactionId: string,
    updateTransactionParams: UpdateTransactionSchema
  ): Promise<Transaction | undefined>;
}

export interface IGetTransactionsByUserIdRepository {
  execute(userId: string): Promise<Transaction[]>;
}

export interface IDeleteTransactionRepository {
  execute(id: string): Promise<boolean>;
}
