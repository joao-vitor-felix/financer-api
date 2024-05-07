import { IGetUserByEmailRepository } from "@/types/user";
import { prisma } from "../../../../prisma/client";

export class PostgresGetUserByEmailRepository
  implements IGetUserByEmailRepository
{
  async getUserByEmail(email: string) {
    const userReturned = await prisma.user.findUnique({
      where: {
        email
      }
    });

    return userReturned;
  }
}
