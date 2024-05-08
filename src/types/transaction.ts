import { Transaction } from "@prisma/client";
import { Request } from "express";

import { Response } from "@/controllers/helpers";
import { CreateTransactionSchema, UpdateTransactionSchema } from "@/schemas";

export interface ICreateTransactionController {
  createTransaction(httpRequest: Request): Promise<Response<Transaction>>;
}

export interface ICreateTransactionRepository {
  createTransaction(transaction: CreateTransactionSchema): Promise<Transaction>;
}

export interface ICreateTransactionUseCase {
  createTransaction(transaction: CreateTransactionSchema): Promise<Transaction>;
}

export interface IUpdateTransactionController {
  updateTransaction(httpRequest: Request): Promise<Response<Transaction>>;
}

export interface IUpdateTransactionUseCase {
  updateTransaction(
    transactionId: string,
    updateTransactionParams: UpdateTransactionSchema
  ): Promise<Transaction | null>;
}

export interface IUpdateTransactionRepository {
  updateTransaction(
    transactionId: string,
    updateTransactionParams: UpdateTransactionSchema
  ): Promise<Transaction | null>;
}

export interface IGetTransactionsByUserIdController {
  getTransactions(httpRequest: Request): Promise<Response<Transaction[]>>;
}

export interface IGetTransactionsByUserIdUseCase {
  getTransactions(userId: string): Promise<Transaction[]>;
}

export interface IGetTransactionsByUserIdRepository {
  getTransactions(userId: string): Promise<Transaction[]>;
}

export interface IDeleteTransactionController {
  deleteTransaction(httpRequest: Request): Promise<Response<null>>;
}

export interface IDeleteTransactionUseCase {
  deleteTransaction(id: string): Promise<null | undefined>;
}

export interface IDeleteTransactionRepository {
  deleteTransaction(id: string): Promise<null | undefined>;
}
