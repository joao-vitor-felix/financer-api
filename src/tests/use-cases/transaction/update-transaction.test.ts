import { faker } from "@faker-js/faker";
import { Transaction } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

import { UpdateTransactionSchema } from "@/schemas";
import { UpdateTransactionUseCase } from "@/use-cases";

describe("UpdateTransactionUseCase", () => {
  const transactionId = faker.string.uuid();

  const transaction: Transaction = {
    id: transactionId,
    userId: faker.string.uuid(),
    name: faker.commerce.productName(),
    date: faker.date.recent().toISOString() as unknown as Date,
    type: "EXPENSE",
    amount: new Decimal(faker.number.int())
  };

  const params: UpdateTransactionSchema = {
    name: "Tiger",
    type: "EARNING",
    amount: 1000
  };

  class UpdateTransactionRepositoryStub {
    async execute(transactionId: string, params: UpdateTransactionSchema) {
      return {
        id: transactionId,
        userId: transaction.userId,
        name: params.name ?? transaction.name,
        date: (params.date as unknown as Date) ?? transaction.date,
        type: params.type ?? transaction.type,
        amount: params.amount ? new Decimal(params.amount) : transaction.amount
      };
    }
  }

  function makeSut() {
    const updateTransactionRepository = new UpdateTransactionRepositoryStub();
    const sut = new UpdateTransactionUseCase(updateTransactionRepository);

    return {
      sut,
      updateTransactionRepository
    };
  }

  it("should update a transaction successfully", async () => {
    const { sut } = makeSut();

    const result = await sut.execute(transactionId, params);

    expect(result).toEqual({
      id: transactionId,
      userId: transaction.userId,
      name: params.name,
      date: transaction.date,
      type: params.type,
      amount: new Decimal(params.amount!)
    });
  });

  it("should call UpdateTransactionRepository with correct params", async () => {
    const { sut, updateTransactionRepository } = makeSut();
    const spy = vi.spyOn(updateTransactionRepository, "execute");

    await sut.execute(transactionId, params);

    expect(spy).toHaveBeenCalledOnce();
    expect(spy).toHaveBeenCalledWith(transactionId, params);
  });

  it.todo("should throw if UpdateTransactionRepository throws", async () => {});
});
