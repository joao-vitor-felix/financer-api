/* eslint-disable @typescript-eslint/no-unused-vars */
import { PostgresCreateUserRepository } from "@/repositories/postgres";
import { user as userFixture } from "@/tests/fixtures/user";

describe("CreateUserRepository", () => {
  const sut = new PostgresCreateUserRepository();

  it("should create a user successfully", async () => {
    const { id, ...user } = userFixture;

    const result = await sut.execute(user);

    expect(result).toEqual({
      ...user,
      id: expect.any(String)
    });
  });
});
