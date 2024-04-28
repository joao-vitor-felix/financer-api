import { prisma } from "../../../../prisma/client.js";

export class PostgresUpdateUserRepository {
  async updateUser(userId, updateUserParams) {
    const user = await prisma.user.update({
      where: {
        id: userId
      },
      data: updateUserParams
    });

    return user;
  }
}
