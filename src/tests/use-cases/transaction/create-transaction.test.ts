import { faker } from "@faker-js/faker";

import { UserNotFoundError } from "@/errors";
import { CreateTransactionSchema } from "@/schemas";
import { GetUserByIdRepositoryStub } from "@/tests/stubs/GetUserByIdRepositoryStub";
import { CreateTransactionUseCase } from "@/use-cases";

describe("CreateTransactionUseCase", () => {
  class CreateTransactionRepositoryStub {
    async execute(transaction: any) {
      return {
        ...transaction,
        id: faker.string.uuid()
      };
    }
  }

  function makeSut() {
    const createTransactionRepository = new CreateTransactionRepositoryStub();
    const getUserByIdRepository = new GetUserByIdRepositoryStub();
    const sut = new CreateTransactionUseCase(
      createTransactionRepository,
      getUserByIdRepository
    );

    return {
      sut,
      createTransactionRepository,
      getUserByIdRepository
    };
  }

  const transaction: CreateTransactionSchema = {
    userId: faker.string.uuid(),
    name: faker.commerce.productName(),
    date: faker.date.anytime().toISOString(),
    type: "EXPENSE",
    amount: faker.number.int()
  };

  it("should create a transaction successfully", async () => {
    const { sut } = makeSut();

    const result = await sut.execute(transaction);

    expect(result).toEqual({
      id: expect.any(String),
      ...transaction
    });
  });

  it("should call GetUserByIdRepository with correct param", async () => {
    const { sut, getUserByIdRepository } = makeSut();
    const spy = vi.spyOn(getUserByIdRepository, "execute");

    await sut.execute(transaction);

    expect(spy).toHaveBeenCalledOnce();
    expect(spy).toHaveBeenCalledWith(transaction.userId);
  });

  it("should throw UserNotFoundError if GetUserByIdRepository returns no user", async () => {
    const { sut, getUserByIdRepository } = makeSut();
    vi.spyOn(getUserByIdRepository, "execute").mockResolvedValueOnce(null);

    await expect(sut.execute(transaction)).rejects.toBeInstanceOf(
      UserNotFoundError
    );
  });

  it("should call CreateTransactionRepository with correct params", async () => {
    const { sut, createTransactionRepository } = makeSut();
    const spy = vi.spyOn(createTransactionRepository, "execute");

    await sut.execute(transaction);

    expect(spy).toHaveBeenCalledOnce();
    expect(spy).toHaveBeenCalledWith(transaction);
  });

  it.todo("should throw if CreateTransactionRepository throws", async () => {});

  it.todo("should throw if GetUserByIdRepository throws", async () => {});
});
