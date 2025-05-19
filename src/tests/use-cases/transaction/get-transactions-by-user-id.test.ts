/* eslint-disable @typescript-eslint/no-unused-vars */
import { faker } from "@faker-js/faker";
import { Transaction } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

import { UserNotFoundError } from "@/errors";
import { GetUserByIdRepositoryStub } from "@/tests/stubs/GetUserByIdRepositoryStub";
import { GetTransactionsByUserIdUseCase } from "@/use-cases";

describe("GetTransactionsByUserIdUseCase", () => {
  const userId = faker.string.uuid();
  const transactions: Transaction[] = [
    {
      id: faker.string.uuid(),
      userId,
      name: faker.commerce.productName(),
      date: faker.date.recent().toISOString() as unknown as Date,
      type: "EXPENSE",
      amount: new Decimal(faker.number.int())
    }
  ];

  class GetTransactionsByUserIdRepositoryStub {
    async execute(_userId: string): Promise<Transaction[]> {
      return transactions;
    }
  }

  function makeSut() {
    const getTransactionsByUserIdRepository =
      new GetTransactionsByUserIdRepositoryStub();
    const getUserByIdRepository = new GetUserByIdRepositoryStub();
    const sut = new GetTransactionsByUserIdUseCase(
      getTransactionsByUserIdRepository,
      getUserByIdRepository
    );

    return {
      sut,
      getTransactionsByUserIdRepository,
      getUserByIdRepository
    };
  }

  it("should retrieve user transaction successfully", async () => {
    const { sut } = makeSut();

    const result = await sut.execute(userId);

    expect(result).toEqual(transactions);
  });

  it("should call GetUserByIdRepository with correct param", async () => {
    const { sut, getUserByIdRepository } = makeSut();
    const spy = vi.spyOn(getUserByIdRepository, "execute");

    await sut.execute(userId);

    expect(spy).toHaveBeenCalledOnce();
    expect(spy).toHaveBeenCalledWith(userId);
  });

  it("should throw UserNotFoundError if GetUserByIdRepository returns no user", async () => {
    const { sut, getUserByIdRepository } = makeSut();
    vi.spyOn(getUserByIdRepository, "execute").mockResolvedValueOnce(null);

    await expect(sut.execute(userId)).rejects.toBeInstanceOf(UserNotFoundError);
  });

  it("should call GetTransactionsByUserIdRepository with correct param", async () => {
    const { sut, getTransactionsByUserIdRepository } = makeSut();
    const spy = vi.spyOn(getTransactionsByUserIdRepository, "execute");

    await sut.execute(userId);

    expect(spy).toHaveBeenCalledOnce();
    expect(spy).toHaveBeenCalledWith(userId);
  });

  it.todo("should throw if GetUserByIdRepository throws", async () => {});

  it.todo(
    "should throw if GetTransactionsByUserIdRepository throws",
    async () => {}
  );
});
