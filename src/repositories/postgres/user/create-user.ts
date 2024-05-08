import { CreateUserSchema } from "@/schemas";
import { ICreateUserRepository } from "@/types";

import { prisma } from "../../../../prisma/client";

interface CreateUserRepositoryParams extends CreateUserSchema {
  password: string;
}

export class PostgresCreateUserRepository implements ICreateUserRepository {
  async createUser(params: CreateUserRepositoryParams) {
    const user = await prisma.user.create({
      data: params
    });

    return user;
  }
}
