import { Decimal } from "@prisma/client/runtime/library";

import { CreateUserSchema, UpdateUserSchema } from "@/schemas";

export type UserDTO = Omit<CreateUserSchema, "password"> & {
  hashedPassword: string;
};
export type User = Omit<CreateUserSchema, "password"> & {
  id: string;
};

export interface ICreateUserRepository {
  execute(params: UserDTO): Promise<User>;
}

export interface IUpdateUserRepository {
  execute(userId: string, updateUserParams: UpdateUserSchema): Promise<User>;
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
