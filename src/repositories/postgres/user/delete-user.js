import { prisma } from "../../../../prisma/client.js";

export class PostgresDeleteUserRepository {
  async deleteUser(id) {
    await prisma.user.delete({
      where: {
        id
      }
    });
  }
}
