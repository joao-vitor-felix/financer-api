import { prisma } from "@/lib/client";
import { IDeleteUserRepository } from "@/types";

export class PostgresDeleteUserRepository implements IDeleteUserRepository {
  async deleteUser(id: string) {
    await prisma.user.delete({
      where: {
        id
      }
    });
  }
}
