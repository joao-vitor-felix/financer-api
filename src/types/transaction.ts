import { CreateTransactionSchema } from "@/schemas";
import { Transaction } from "@prisma/client";
import { Response } from "@/controllers/helpers";
import { Request } from "express";

export interface ICreateTransactionController {
  createTransaction(httpRequest: Request): Promise<Response<Transaction>>;
}

export interface ICreateTransactionRepository {
  createTransaction(transaction: CreateTransactionSchema): Promise<Transaction>;
}

export interface ICreateTransactionUseCase {
  createTransaction(transaction: CreateTransactionSchema): Promise<Transaction>;
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
