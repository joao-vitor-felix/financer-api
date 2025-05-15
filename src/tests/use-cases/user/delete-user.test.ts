/* eslint-disable @typescript-eslint/no-unused-vars */
import { faker } from "@faker-js/faker";

import { DeleteUserUseCase, GetUserByIdUseCase } from "@/use-cases";

describe("DeleteUserUseCase", () => {
  class GetUserByIdUseCaseStub {
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
    const getUserByIdUseCase =
      new GetUserByIdUseCaseStub() as GetUserByIdUseCase;
    const deleteUserRepository = new DeleteUserRepositoryStub();

    const sut = new DeleteUserUseCase(deleteUserRepository, getUserByIdUseCase);

    return {
      sut,
      getUserByIdUseCase,
      deleteUserRepository
    };
  }

  it("should delete user successfully", async () => {
    const { sut } = makeSut();

    const result = await sut.execute("any_id");

    expect(result).toBeUndefined();
  });

  it("should GetUserByIdUseCase with correct param", async () => {
    const { sut, getUserByIdUseCase } = makeSut();
    const spy = vi.spyOn(getUserByIdUseCase, "execute");

    await sut.execute("any_id");

    expect(spy).toHaveBeenCalledOnce();
    expect(spy).toHaveBeenCalledWith("any_id");
  });
  it.todo("should throw if GetUserByIdUseCase throws", async () => {});
  it.todo("should throw if DeleteUserRepository throws", async () => {});
});
