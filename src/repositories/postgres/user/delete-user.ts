import { IDeleteUserRepository } from "@/types";

import { prisma } from "../../../../prisma/client";

export class PostgresDeleteUserRepository implements IDeleteUserRepository {
  async deleteUser(id: string) {
    await prisma.user.delete({
      where: {
        id
      }
    });
  }
}
