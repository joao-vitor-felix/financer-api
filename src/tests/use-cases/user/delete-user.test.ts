/* eslint-disable @typescript-eslint/no-unused-vars */

import { UserNotFoundError } from "@/errors";
import { GetUserByIdRepositoryStub } from "@/tests/stubs/GetUserByIdRepositoryStub";
import { DeleteUserUseCase } from "@/use-cases";

describe("DeleteUserUseCase", () => {
  class DeleteUserRepositoryStub {
    async execute(_id: string): Promise<void> {
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

  it("should throw UserNotFoundError if GetUserByIdRepository returns null", async () => {
    const { sut, getUserByIdRepository } = makeSut();
    vi.spyOn(getUserByIdRepository, "execute").mockResolvedValueOnce(null);

    expect(sut.execute("any_id")).rejects.toBeInstanceOf(UserNotFoundError);
  });

  it("should throw if GetUserByIdRepository throws", async () => {
    const { sut, getUserByIdRepository } = makeSut();
    vi.spyOn(getUserByIdRepository, "execute").mockRejectedValueOnce(
      new Error()
    );

    expect(sut.execute("any_id")).rejects.toThrow();
  });

  it("should throw if DeleteUserRepository throws", async () => {
    const { sut, deleteUserRepository } = makeSut();
    vi.spyOn(deleteUserRepository, "execute").mockRejectedValueOnce(
      new Error()
    );

    expect(sut.execute("any_id")).rejects.toThrow();
  });
});
