import { prisma } from "../../../../prisma/client.js";

export class PostgresDeleteUserRepository {
  async deleteUser(id) {
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
