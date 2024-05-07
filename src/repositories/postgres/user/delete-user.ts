import { IDeleteUserRepository } from "@/types";
import { prisma } from "../../../../prisma/client";

export class PostgresDeleteUserRepository implements IDeleteUserRepository {
  async deleteUser(id: string) {
    try {
      await prisma.user.delete({
        where: {
          id
        }
      });
    } catch (error) {
      return null;
    }
  }
}
