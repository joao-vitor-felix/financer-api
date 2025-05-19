/* eslint-disable @typescript-eslint/no-unused-vars */
import { TransactionNotFoundError } from "@/errors";
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

  it("should call DeleteTransactionRepository with correct param", async () => {
    const { sut, deleteTransactionRepository } = makeSut();
    const spy = vi.spyOn(deleteTransactionRepository, "execute");

    await sut.execute(transactionId);

    expect(spy).toHaveBeenCalledOnce();
    expect(spy).toHaveBeenCalledWith(transactionId);
  });

  it("should throw TransactionNotFoundError if DeleteTransactionRepository returns false", async () => {
    const { sut, deleteTransactionRepository } = makeSut();
    vi.spyOn(deleteTransactionRepository, "execute").mockResolvedValueOnce(
      false
    );

    await expect(sut.execute(transactionId)).rejects.toBeInstanceOf(
      TransactionNotFoundError
    );
  });

  it("should throw if DeleteTransactionRepository throws", async () => {
    const { sut, deleteTransactionRepository } = makeSut();
    vi.spyOn(deleteTransactionRepository, "execute").mockRejectedValueOnce(
      new Error()
    );

    await expect(sut.execute(transactionId)).rejects.toThrow();
  });
});
