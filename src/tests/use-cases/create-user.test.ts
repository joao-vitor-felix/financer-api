/* eslint-disable @typescript-eslint/no-unused-vars */
import { faker } from "@faker-js/faker";

import { PasswordHasherAdapter } from "@/adapters";
import { CreateUserUseCase } from "@/use-cases";

describe("CreateUserUseCase", () => {
  class PasswordHasherAdapterStub {
    async hash(_password: string) {
      return "hashed_password";
    }
  }

  class GetUserByEmailRepositoryStub {
    async execute(_email: string) {
      return null;
    }
  }

  class CreateUserRepositoryStub {
    async execute(user: any) {
      return {
        ...user,
        id: "any_id"
      };
    }
  }

  function makeSut() {
    const passwordHasherAdapter =
      new PasswordHasherAdapterStub() as PasswordHasherAdapter;
    const getUserByEmailRepository = new GetUserByEmailRepositoryStub();
    const createUserRepository = new CreateUserRepositoryStub();

    const sut = new CreateUserUseCase(
      getUserByEmailRepository,
      createUserRepository,
      passwordHasherAdapter
    );

    return {
      sut,
      passwordHasherAdapter,
      getUserByEmailRepository,
      createUserRepository
    };
  }

  const user = {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password({
      length: 6
    })
  };

  it("should create a user successfully", async () => {
    const { sut } = makeSut();

    const result = await sut.execute(user);

    expect(result).toEqual({
      id: "any_id",
      hashedPassword: "hashed_password",
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email
    });
  });

  it.todo(
    "should call GetUserByEmailRepository with correct param",
    async () => {}
  );

  it.todo(
    "should call PasswordHasherAdapter with correct param",
    async () => {}
  );

  it.todo(
    "should call CreateUserRepository with correct param",
    async () => {}
  );

  it.todo(
    "should throw EmailAlreadyInUseError if email is already in use",
    async () => {}
  );

  it.todo("should throw if GetUserByEmailRepository throws", async () => {});

  it.todo("should throw if PasswordHasherAdapter throws", async () => {});

  it.todo("should throw if CreateUserRepository throws", async () => {});
});
