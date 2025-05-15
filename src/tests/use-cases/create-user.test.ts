/* eslint-disable @typescript-eslint/no-unused-vars */
import { faker } from "@faker-js/faker";

import { PasswordHasherAdapter } from "@/adapters";
import { EmailAlreadyInUseError } from "@/errors";
import { CreateUserUseCase } from "@/use-cases";

describe("CreateUserUseCase", () => {
  class PasswordHasherAdapterStub {
    async hash(_password: string) {
      return "hashed_password";
    }
  }

  class GetUserByEmailRepositoryStub {
    async execute(_email: string): Promise<any> {
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

  it("should call GetUserByEmailRepository with correct param", async () => {
    const { sut, getUserByEmailRepository } = makeSut();
    const spy = vi.spyOn(getUserByEmailRepository, "execute");

    await sut.execute(user);

    expect(spy).toHaveBeenCalledOnce();
    expect(spy).toHaveBeenCalledWith(user.email);
  });

  it("should call PasswordHasherAdapter with correct param", async () => {
    const { sut, passwordHasherAdapter } = makeSut();
    const spy = vi.spyOn(passwordHasherAdapter, "hash");

    await sut.execute(user);

    expect(spy).toHaveBeenCalledOnce();
    expect(spy).toHaveBeenCalledWith(user.password);
  });

  it("should call CreateUserRepository with correct params", async () => {
    const { sut, createUserRepository } = makeSut();
    const spy = vi.spyOn(createUserRepository, "execute");

    await sut.execute(user);

    expect(spy).toHaveBeenCalledOnce();
    expect(spy).toHaveBeenCalledWith({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      hashedPassword: "hashed_password"
    });
  });

  it("should throw EmailAlreadyInUseError if GetUserByEmailRepository return a user", async () => {
    const { sut, getUserByEmailRepository } = makeSut();
    vi.spyOn(getUserByEmailRepository, "execute").mockResolvedValueOnce({
      id: faker.string.uuid(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: user.email,
      hashedPassword: faker.string.nanoid()
    });

    await expect(sut.execute(user)).rejects.toBeInstanceOf(
      EmailAlreadyInUseError
    );
  });

  it("should throw if GetUserByEmailRepository throws", async () => {
    const { sut, getUserByEmailRepository } = makeSut();
    vi.spyOn(getUserByEmailRepository, "execute").mockRejectedValueOnce(
      new Error()
    );

    await expect(sut.execute(user)).rejects.toThrow();
  });

  it("should throw if PasswordHasherAdapter throws", async () => {
    const { sut, passwordHasherAdapter } = makeSut();
    vi.spyOn(passwordHasherAdapter, "hash").mockRejectedValueOnce(new Error());

    await expect(sut.execute(user)).rejects.toThrow();
  });

  it.todo("should throw if CreateUserRepository throws", async () => {});
});
