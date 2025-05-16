import { faker } from "@faker-js/faker";
import { User } from "@prisma/client";

import { PasswordHasherAdapter } from "@/adapters";
import { UpdateUserSchema } from "@/schemas";
import { user } from "@/tests/fixtures/user";
import { GetUserByEmailRepositoryStub } from "@/tests/stubs/GetUserByEmailRepositoryStub";
import { GetUserByIdRepositoryStub } from "@/tests/stubs/GetUserByIdRepositoryStub";
import { PasswordHasherAdapterStub } from "@/tests/stubs/PasswordHasherAdapterStub";
import { UpdateUserUseCase } from "@/use-cases";

describe("UpdateUserUseCase", () => {
  class UpdateUserRepositoryStub {
    async execute(userId: string, params: UpdateUserSchema): Promise<User> {
      return {
        id: userId,
        firstName: params.firstName ?? user.firstName,
        lastName: params.lastName ?? user.lastName,
        email: params.email ?? user.email,
        hashedPassword: params.password
          ? "hashed_password"
          : user.hashedPassword
      };
    }
  }

  function makeSut() {
    const updateUserRepository = new UpdateUserRepositoryStub();
    const getUserByIdRepository = new GetUserByIdRepositoryStub();
    const getUserByEmailRepository = new GetUserByEmailRepositoryStub();
    const passwordHasherAdapter =
      new PasswordHasherAdapterStub() as PasswordHasherAdapter;

    const sut = new UpdateUserUseCase(
      getUserByIdRepository,
      getUserByEmailRepository,
      updateUserRepository,
      passwordHasherAdapter
    );

    return {
      sut,
      updateUserRepository,
      getUserByIdRepository,
      getUserByEmailRepository,
      passwordHasherAdapter
    };
  }

  const userParams = {
    email: faker.internet.email(),
    password: faker.internet.password()
  };

  it("should update user successfully", async () => {
    const { sut } = makeSut();

    const result = await sut.execute(user.id, userParams);

    expect(result).toEqual({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: userParams.email,
      hashedPassword: "hashed_password"
    });
  });

  it.todo(
    "should call GetUserByIdRepository with correct param",
    async () => {}
  );

  it.todo(
    "should throw UserNotFoundError if GetUserByIdRepository returns null",
    async () => {}
  );

  it.todo(
    "should call GetUserByEmailRepository with correct param when email is provided",
    async () => {}
  );

  it.todo(
    "should not call GetUserByEmailRepository when email is not provided",
    async () => {}
  );

  it.todo(
    "should throw EmailAlreadyInUseError if email is already in use",
    async () => {}
  );

  it.todo(
    "should call PasswordHasherAdapter with correct param when password is provided",
    async () => {}
  );

  it.todo(
    "should not call PasswordHasherAdapter when password is not provided",
    async () => {}
  );

  it.todo(
    "should call UpdateUserRepository with correct params",
    async () => {}
  );

  it.todo("should throw if GetUserByIdRepository throws", async () => {});

  it.todo("should throw if GetUserByEmailRepository throws", async () => {});

  it.todo("should throw if PasswordHasherAdapter throws", async () => {});

  it.todo("should throw if UpdateUserRepository throws", async () => {});
});
