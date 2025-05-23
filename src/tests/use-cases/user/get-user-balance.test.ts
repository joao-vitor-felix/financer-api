/* eslint-disable @typescript-eslint/no-unused-vars */
import { faker } from "@faker-js/faker";
import { Decimal } from "@prisma/client/runtime/library";

import { UserNotFoundError } from "@/errors";
import { GetUserByIdRepositoryStub } from "@/tests/stubs/GetUserByIdRepositoryStub";
import { GetUserBalanceUseCase } from "@/use-cases";

describe("GetUserBalanceUseCase", () => {
  const balance = {
    earnings: new Decimal(faker.number.int({ min: 1000, max: 2000 })),
    expenses: new Decimal(faker.number.int({ min: 0, max: 1000 })),
    investments: new Decimal(faker.number.int({ min: 0, max: 1000 })),
    balance: new Decimal(faker.number.int({ min: 0, max: 2000 }))
  };

  class GetUserBalanceRepositoryStub {
    async execute(_userId: string) {
      return balance;
    }
  }

  function makeSut() {
    const getUserByIdRepository = new GetUserByIdRepositoryStub();
    const getUserBalanceRepository = new GetUserBalanceRepositoryStub();
    const sut = new GetUserBalanceUseCase(
      getUserBalanceRepository,
      getUserByIdRepository
    );

    return {
      sut,
      getUserByIdRepository,
      getUserBalanceRepository
    };
  }

  it("should return user balance successfully", async () => {
    const { sut } = makeSut();

    const balanceReturned = await sut.execute("any_id");

    expect(balanceReturned).toEqual(balance);
  });

  it("should call GetUserByIdRepository with correct param", async () => {
    const { sut, getUserByIdRepository } = makeSut();
    const spy = vi.spyOn(getUserByIdRepository, "execute");

    await sut.execute("any_id");

    expect(spy).toHaveBeenCalledOnce();
    expect(spy).toHaveBeenCalledWith("any_id");
  });

  it("should call GetUserBalanceRepository with correct param", async () => {
    const { sut, getUserBalanceRepository } = makeSut();
    const spy = vi.spyOn(getUserBalanceRepository, "execute");

    await sut.execute("any_id");

    expect(spy).toHaveBeenCalledOnce();
    expect(spy).toHaveBeenCalledWith("any_id");
  });

  it("should throw UserNotFoundError if GetUserByIdRepository returns null", async () => {
    const { sut, getUserByIdRepository } = makeSut();
    vi.spyOn(getUserByIdRepository, "execute").mockResolvedValueOnce(null);

    await expect(sut.execute("any_id")).rejects.toBeInstanceOf(
      UserNotFoundError
    );
  });

  it("should throw if GetUserByIdRepository throws", async () => {
    const { sut, getUserByIdRepository } = makeSut();
    vi.spyOn(getUserByIdRepository, "execute").mockRejectedValueOnce(
      new Error()
    );

    await expect(sut.execute("any_id")).rejects.toThrow();
  });

  it("should throw if GetUserBalanceRepository throws", async () => {
    const { sut, getUserBalanceRepository } = makeSut();
    vi.spyOn(getUserBalanceRepository, "execute").mockRejectedValueOnce(
      new Error()
    );

    await expect(sut.execute("any_id")).rejects.toThrow();
  });
});
