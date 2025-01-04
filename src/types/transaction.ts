import { Transaction } from "@prisma/client";

import { CreateTransactionSchema, UpdateTransactionSchema } from "@/schemas";

export interface ICreateTransactionRepository {
  createTransaction(transaction: CreateTransactionSchema): Promise<Transaction>;
}

export interface IUpdateTransactionRepository {
  updateTransaction(
    transactionId: string,
    updateTransactionParams: UpdateTransactionSchema
  ): Promise<Transaction | null>;
}

export interface IGetTransactionsByUserIdRepository {
  getTransactions(userId: string): Promise<Transaction[]>;
}

export interface IDeleteTransactionRepository {
  deleteTransaction(id: string): Promise<null | undefined>;
}
