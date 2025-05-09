import { prisma } from "@/lib/client";
import { IGetUserByEmailRepository } from "@/types/user";

export class PostgresGetUserByEmailRepository
  implements IGetUserByEmailRepository
{
  async execute(email: string) {
    const userReturned = await prisma.user.findUnique({
      where: {
        email
      }
    });

    return userReturned;
  }
}
