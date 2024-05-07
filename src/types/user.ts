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

export interface IGetUserByEmailRepository {
  getUserByEmail(email: string): Promise<User | null>;
}
