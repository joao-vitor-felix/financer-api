import { User } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

import { CreateUserSchema, UpdateUserSchema } from "@/schemas";

export interface ICreateUserRepository {
  execute(
    params: Omit<CreateUserSchema, "password"> & { hashedPassword: string }
  ): Promise<User>;
}

export interface IUpdateUserRepository {
  updateUser(userId: string, updateUserParams: UpdateUserSchema): Promise<User>;
}

export interface IDeleteUserRepository {
  execute(id: string): Promise<void>;
}

export type Balance = {
  earnings: Decimal;
  expenses: Decimal;
  investments: Decimal;
  balance: Decimal;
};

export interface IGetUserBalanceRepository {
  execute(userId: string): Promise<Balance>;
}

export interface IGetUserByEmailRepository {
  execute(email: string): Promise<User | null>;
}

export interface IGetUserByIdRepository {
  execute(id: string): Promise<User | null>;
}
