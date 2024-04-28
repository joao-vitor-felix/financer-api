import { prisma } from "../../../../prisma/client.js";

export class PostgresGetUserByIdRepository {
  async getUserById(id) {
    const userReturned = await prisma.user.findUnique({
      where: {
        id
      }
    });

    return userReturned;
  }
}
