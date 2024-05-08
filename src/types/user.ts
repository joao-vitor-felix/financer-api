import { Prisma, User } from "@prisma/client";
import { Response } from "@/controllers/helpers";
import { Request } from "express";

export interface CreateUserParams {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface ICreateUserController {
  createUser(httpRequest: Request): Promise<Response<User>>;
}

export interface ICreateUserUseCase {
  createUser(params: CreateUserParams): Promise<User>;
}

export interface ICreateUserRepository {
  createUser(params: CreateUserParams): Promise<User>;
}

export type UpdateUserParams = Partial<CreateUserParams>;

export interface IUpdateUserController {
  updateUser(httpRequest: Request): Promise<Response<User>>;
}

export interface IUpdateUserUseCase {
  updateUser(userId: string, updateUserParams: UpdateUserParams): Promise<User>;
}
export interface IUpdateUserRepository {
  updateUser(userId: string, updateUserParams: UpdateUserParams): Promise<User>;
}

export interface IDeleteUserController {
  deleteUser(httpRequest: Request): Promise<Response<null>>;
}

export interface IDeleteUserUseCase {
  deleteUser(id: string): Promise<null | undefined>;
}

export interface IDeleteUserRepository {
  deleteUser(id: string): Promise<null | undefined>;
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
