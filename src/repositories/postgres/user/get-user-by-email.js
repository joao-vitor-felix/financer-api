import { prisma } from "../../../../prisma/client.js";

export class PostgresGetUserByEmailRepository {
  async getUserByEmail(email) {
    const userReturned = await prisma.user.findUnique({
      where: {
        email
      }
    });

    return userReturned;
  }
}
