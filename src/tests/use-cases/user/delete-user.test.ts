/* eslint-disable @typescript-eslint/no-unused-vars */
import { faker } from "@faker-js/faker";

import { DeleteUserUseCase } from "@/use-cases";

describe("DeleteUserUseCase", () => {
  class GetUserByIdRepositoryStub {
    async execute(_id: string): Promise<any> {
      return {
        id: "any_id",
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        hashedPassword: faker.string.nanoid()
      };
    }
  }

  class DeleteUserRepositoryStub {
    async deleteUser(_id: string): Promise<void> {
      return;
    }
  }

  function makeSut() {
    const getUserByIdRepository = new GetUserByIdRepositoryStub();
    const deleteUserRepository = new DeleteUserRepositoryStub();

    const sut = new DeleteUserUseCase(
      deleteUserRepository,
      getUserByIdRepository
    );

    return {
      sut,
      getUserByIdRepository,
      deleteUserRepository
    };
  }

  it("should delete user successfully", async () => {
    const { sut } = makeSut();

    const result = await sut.execute("any_id");

    expect(result).toBeUndefined();
  });

  it("should GetUserByIdRepository with correct param", async () => {
    const { sut, getUserByIdRepository } = makeSut();
    const spy = vi.spyOn(getUserByIdRepository, "execute");

    await sut.execute("any_id");

    expect(spy).toHaveBeenCalledOnce();
    expect(spy).toHaveBeenCalledWith("any_id");
  });

  it.todo(
    "should throw UserNotFoundError if GetUserByIdRepository returns null",
    async () => {}
  );

  it.todo("should throw if GetUserByIdUseCase throws", async () => {});

  it.todo("should throw if DeleteUserRepository throws", async () => {});
});
