import { faker } from "@faker-js/faker";
import { User } from "@prisma/client";

import { PasswordHasherAdapter } from "@/adapters";
import { EmailAlreadyInUseError, UserNotFoundError } from "@/errors";
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
    const getUserByIdRepository = new GetUserByIdRepositoryStub();
    const getUserByEmailRepository = new GetUserByEmailRepositoryStub();
    const updateUserRepository = new UpdateUserRepositoryStub();
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
    password: faker.internet.password({
      length: 6
    })
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

  it("should call GetUserByIdRepository with correct param", async () => {
    const { sut, getUserByIdRepository } = makeSut();
    const spy = vi.spyOn(getUserByIdRepository, "execute");

    await sut.execute(user.id, userParams);

    expect(spy).toHaveBeenCalledOnce();
    expect(spy).toHaveBeenCalledWith(user.id);
  });

  it("should throw UserNotFoundError if GetUserByIdRepository returns null", async () => {
    const { sut, getUserByIdRepository } = makeSut();
    vi.spyOn(getUserByIdRepository, "execute").mockResolvedValueOnce(null);

    await expect(sut.execute(user.id, userParams)).rejects.toBeInstanceOf(
      UserNotFoundError
    );
  });

  it("should call GetUserByEmailRepository with correct param when email is provided", async () => {
    const { sut, getUserByEmailRepository } = makeSut();
    const spy = vi.spyOn(getUserByEmailRepository, "execute");

    await sut.execute(user.id, userParams);

    expect(spy).toHaveBeenCalledOnce();
    expect(spy).toHaveBeenCalledWith(userParams.email);
  });

  it("should not call GetUserByEmailRepository when email is not provided", async () => {
    const { sut, getUserByEmailRepository } = makeSut();
    const spy = vi.spyOn(getUserByEmailRepository, "execute");

    await sut.execute(user.id, {
      password: "123456641"
    });

    expect(spy).not.toHaveBeenCalledOnce();
  });

  it("should throw EmailAlreadyInUseError if email is already in use", async () => {
    const { sut, getUserByEmailRepository } = makeSut();
    vi.spyOn(getUserByEmailRepository, "execute").mockResolvedValueOnce({
      id: faker.string.uuid(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: userParams.email,
      hashedPassword: faker.string.nanoid()
    });

    await expect(sut.execute(user.id, userParams)).rejects.toBeInstanceOf(
      EmailAlreadyInUseError
    );
  });

  it("should call PasswordHasherAdapter with correct param when password is provided", async () => {
    const { sut, passwordHasherAdapter } = makeSut();
    const spy = vi.spyOn(passwordHasherAdapter, "hash");

    await sut.execute(user.id, userParams);

    expect(spy).toHaveBeenCalledOnce();
    expect(spy).toHaveBeenCalledWith(userParams.password);
  });

  it("should not call PasswordHasherAdapter when password is not provided", async () => {
    const { sut, passwordHasherAdapter } = makeSut();
    const spy = vi.spyOn(passwordHasherAdapter, "hash");

    await sut.execute(user.id, {
      email: userParams.email
    });

    expect(spy).not.toHaveBeenCalledOnce();
  });

  it("should call UpdateUserRepository with correct params", async () => {
    const { sut, updateUserRepository } = makeSut();
    const spy = vi.spyOn(updateUserRepository, "execute");

    await sut.execute(user.id, userParams);

    expect(spy).toHaveBeenCalledOnce();
    expect(spy).toHaveBeenCalledWith(user.id, userParams);
  });

  it("should throw if GetUserByIdRepository throws", async () => {
    const { sut, getUserByIdRepository } = makeSut();
    vi.spyOn(getUserByIdRepository, "execute").mockRejectedValueOnce(
      new Error()
    );

    await expect(sut.execute(user.id, userParams)).rejects.toThrow();
  });

  it("should throw if GetUserByEmailRepository throws", async () => {
    const { sut, getUserByEmailRepository } = makeSut();
    vi.spyOn(getUserByEmailRepository, "execute").mockRejectedValueOnce(
      new Error()
    );

    await expect(sut.execute(user.id, userParams)).rejects.toThrow();
  });

  it.todo("should throw if PasswordHasherAdapter throws", async () => {});

  it.todo("should throw if UpdateUserRepository throws", async () => {});
});
