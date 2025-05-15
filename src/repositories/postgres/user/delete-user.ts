import { prisma } from "@/lib/client";
import { IDeleteUserRepository } from "@/types";

export class PostgresDeleteUserRepository implements IDeleteUserRepository {
  async execute(id: string) {
    await prisma.user.delete({
      where: {
        id
      }
    });
  }
}
