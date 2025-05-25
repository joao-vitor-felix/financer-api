/* eslint-disable @typescript-eslint/no-unused-vars */

import { prisma } from "@/lib/client";
import { PostgresCreateUserRepository } from "@/repositories/postgres";
import { user as userFixture } from "@/tests/fixtures/user";

describe("CreateUserRepository", () => {
  const sut = new PostgresCreateUserRepository();
  const { id, ...user } = userFixture;

  it("should create a user successfully", async () => {
    const result = await sut.execute(user);

    expect(result).toEqual({
      id: expect.any(String),
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email
    });
  });

  //FIXME: prisma spy is not working
  it.skip("should call prisma with correct params", async () => {
    const spy = vi.spyOn(prisma.user, "create");

    await sut.execute(user);

    expect(spy).toHaveBeenCalledOnce();
    expect(spy).toHaveBeenCalledWith({
      data: user
    });
  });

  it("should throw if Prisma throws", async () => {
    vi.spyOn(prisma.user, "create").mockRejectedValueOnce(new Error());

    await expect(sut.execute(user)).rejects.toThrow();
  });
});
