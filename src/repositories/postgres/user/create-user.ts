import { CreateUserParams, ICreateUserRepository } from "@/types";
import { prisma } from "../../../../prisma/client";

export class PostgresCreateUserRepository implements ICreateUserRepository {
  async createUser(params: CreateUserParams) {
    const user = await prisma.user.create({
      data: params
    });

    return user;
  }
}
