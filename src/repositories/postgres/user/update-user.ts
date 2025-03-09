import { prisma } from "@/lib/client";
import { UpdateUserSchema } from "@/schemas";
import { IUpdateUserRepository } from "@/types";

export class PostgresUpdateUserRepository implements IUpdateUserRepository {
  async updateUser(userId: string, params: UpdateUserSchema) {
    const user = await prisma.user.update({
      where: {
        id: userId
      },
      data: params
    });

    return user;
  }
}
