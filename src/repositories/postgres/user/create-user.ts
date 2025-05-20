import { prisma } from "@/lib/client";
import { CreateUserSchema } from "@/schemas";
import { ICreateUserRepository } from "@/types";

type CreateUserRepositoryParams = Omit<CreateUserSchema, "password"> & {
  hashedPassword: string;
};

export class PostgresCreateUserRepository implements ICreateUserRepository {
  async execute(params: CreateUserRepositoryParams) {
    const user = await prisma.user.create({
      data: params
    });

    return user;
  }
}
