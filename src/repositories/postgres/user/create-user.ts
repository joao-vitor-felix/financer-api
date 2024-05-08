import { CreateUserParams, ICreateUserRepository } from "@/types";

import { prisma } from "../../../../prisma/client";

interface CreateUserRepositoryParams extends CreateUserParams {
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
