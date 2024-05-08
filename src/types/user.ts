import { Prisma, User } from "@prisma/client";
import { Request } from "express";

import { Response } from "@/controllers/helpers";
import { CreateUserSchema, UpdateUserSchema } from "@/schemas";

export interface ICreateUserController {
  createUser(httpRequest: Request): Promise<Response<User>>;
}

export interface ICreateUserUseCase {
  createUser(params: CreateUserSchema): Promise<User>;
}

export interface ICreateUserRepository {
  createUser(params: CreateUserSchema): Promise<User>;
}

export interface IUpdateUserController {
  updateUser(httpRequest: Request): Promise<Response<User>>;
}

export interface IUpdateUserUseCase {
  updateUser(userId: string, updateUserParams: UpdateUserSchema): Promise<User>;
}
export interface IUpdateUserRepository {
  updateUser(userId: string, updateUserParams: UpdateUserSchema): Promise<User>;
}

export interface IDeleteUserController {
  deleteUser(httpRequest: Request): Promise<Response<null>>;
}

export interface IDeleteUserUseCase {
  deleteUser(id: string): Promise<void>;
}

export interface IDeleteUserRepository {
  deleteUser(id: string): Promise<void>;
}

interface UserBalance {
  earnings: Prisma.Decimal;
  expenses: Prisma.Decimal;
  investments: Prisma.Decimal;
  balance: Prisma.Decimal;
}

export interface IGetUserBalanceController {
  getUserBalance(httpRequest: Request): Promise<Response<UserBalance>>;
}

export interface IGetUserBalanceUseCase {
  getUserBalance(userId: string): Promise<UserBalance>;
}

export interface IGetUserBalanceRepository {
  getUserBalance(userId: string): Promise<UserBalance>;
}

export interface IGetUserByEmailRepository {
  getUserByEmail(email: string): Promise<User | null>;
}

export interface IGetUserByIdController {
  getUserById(httpRequest: Request): Promise<Response<User>>;
}

export interface IGetUserByIdUseCase {
  getUserById(id: string): Promise<User | null>;
}

export interface IGetUserByIdRepository {
  getUserById(id: string): Promise<User | null>;
}
