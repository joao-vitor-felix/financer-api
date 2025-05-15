import { prisma } from "@/lib/client";
import { IGetUserByIdRepository } from "@/types";

export class PostgresGetUserByIdRepository implements IGetUserByIdRepository {
  async execute(id: string) {
    const userReturned = await prisma.user.findUnique({
      where: {
        id
      }
    });

    return userReturned;
  }
}
