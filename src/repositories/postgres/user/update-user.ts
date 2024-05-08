import { IUpdateUserRepository, UpdateUserParams } from "@/types";

import { prisma } from "../../../../prisma/client";

export class PostgresUpdateUserRepository implements IUpdateUserRepository {
  async updateUser(userId: string, updateUserParams: UpdateUserParams) {
    const user = await prisma.user.update({
      where: {
        id: userId
      },
      data: updateUserParams
    });

    return user;
  }
}
