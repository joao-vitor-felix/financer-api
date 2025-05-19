/* eslint-disable @typescript-eslint/no-unused-vars */
import { DeleteTransactionUseCase } from "@/use-cases";

describe("DeleteTransactionUseCase", () => {
  class DeleteTransactionRepositoryStub {
    async execute(_id: string) {
      return true;
    }
  }

  function makeSut() {
    const deleteTransactionRepository = new DeleteTransactionRepositoryStub();
    const sut = new DeleteTransactionUseCase(deleteTransactionRepository);

    return {
      sut,
      deleteTransactionRepository
    };
  }

  const transactionId = "any_id";

  it("should delete a transaction successfully", async () => {
    const { sut } = makeSut();

    const result = await sut.execute(transactionId);

    expect(result).toBeUndefined();
  });

  it.todo(
    "should call DeleteTransactionRepository with correct param",
    async () => {}
  );

  it.todo(
    "should throw TransactionNotFoundError if DeleteTransactionRepository returns false",
    async () => {}
  );

  it.todo("should throw if DeleteTransactionRepository throws", async () => {});
});
