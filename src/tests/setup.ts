import { prisma } from "@/lib/client";

beforeEach(async () => {
  await Promise.all([
    prisma.user.deleteMany(),
    prisma.transaction.deleteMany()
  ]);
});
