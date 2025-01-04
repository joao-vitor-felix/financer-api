import { Prisma, User } from "@prisma/client";

import { CreateUserSchema, UpdateUserSchema } from "@/schemas";

export interface ICreateUserRepository {
  execute(params: CreateUserSchema): Promise<User>;
}

export interface IUpdateUserRepository {
  updateUser(userId: string, updateUserParams: UpdateUserSchema): Promise<User>;
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

export interface IGetUserBalanceRepository {
  getUserBalance(userId: string): Promise<UserBalance>;
}

export interface IGetUserByEmailRepository {
  execute(email: string): Promise<User | null>;
}

export interface IGetUserByIdRepository {
  getUserById(id: string): Promise<User | null>;
}
