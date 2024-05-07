import { IGetUserByIdRepository } from "@/types";
import { prisma } from "../../../../prisma/client";

export class PostgresGetUserByIdRepository implements IGetUserByIdRepository {
  async getUserById(id: string) {
    const userReturned = await prisma.user.findUnique({
      where: {
        id
      }
    });

    return userReturned;
  }
}
