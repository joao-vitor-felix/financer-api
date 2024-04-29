import { prisma } from "../../../../prisma/client.js";

export class PostgresCreateUserRepository {
  async createUser(createUserParams) {
    console.log(createUserParams);
    const user = await prisma.user.create({
      data: createUserParams
    });

    return user;
  }
}
