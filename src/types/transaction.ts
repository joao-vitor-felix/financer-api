import { Transaction } from "@prisma/client";

import { CreateTransactionSchema, UpdateTransactionSchema } from "@/schemas";

export interface ICreateTransactionRepository {
  execute(transaction: CreateTransactionSchema): Promise<Transaction>;
}

export interface IUpdateTransactionRepository {
  updateTransaction(
    transactionId: string,
    updateTransactionParams: UpdateTransactionSchema
  ): Promise<Transaction | undefined>;
}

export interface IGetTransactionsByUserIdRepository {
  getTransactions(userId: string): Promise<Transaction[]>;
}

export interface IDeleteTransactionRepository {
  deleteTransaction(id: string): Promise<null | undefined>;
}
