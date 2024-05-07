import { User } from "@prisma/client";
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

export interface IDeleteUserController {
  deleteUser(httpRequest: Request): Promise<Response<null>>;
}

export interface IDeleteUserUseCase {
  deleteUser(id: string): Promise<null | undefined>;
}

export interface IDeleteUserRepository {
  deleteUser(id: string): Promise<null | undefined>;
}

export interface IGetUserByEmailRepository {
  getUserByEmail(email: string): Promise<User | null>;
}

export interface IGetUserByIdUseCase {
  getUserById(id: string): Promise<User | null>;
}

export interface IGetUserByIdRepository {
  getUserById(id: string): Promise<User | null>;
}
