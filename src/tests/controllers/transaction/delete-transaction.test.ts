/* eslint-disable @typescript-eslint/no-unused-vars */
import { faker } from "@faker-js/faker";
import type { Request } from "express";

import { DeleteTransactionController } from "@/controllers";
import { ErrorResponse } from "@/controllers/helpers";
import { DeleteTransactionUseCase } from "@/use-cases";

describe("DeleteTransactionController", () => {
  class DeleteTransactionUseCaseStub {
    async execute(_transactionId: string) {
      return;
    }
  }

  function makeSut() {
    const deleteTransactionUseCase =
      new DeleteTransactionUseCaseStub() as DeleteTransactionUseCase;
    const sut = new DeleteTransactionController(deleteTransactionUseCase);

    return {
      deleteTransactionUseCase,
      sut
    };
  }

  const httpRequest = {
    params: {
      transactionId: faker.string.uuid()
    }
  } as Request<{ transactionId: string }>;

  it("should return 200 when deleted it successfully", async () => {
    const { sut } = makeSut();

    const result = await sut.execute(httpRequest);

    expect(result.statusCode).toBe(200);
    expect(result.body).toBeUndefined();
  });

  it("should return 400 when transactionId is invalid", async () => {
    const { sut } = makeSut();

    const result = (await sut.execute({
      params: {
        transactionId: "invalid"
      }
    } as Request<{ transactionId: string }>)) as ErrorResponse;

    expect(result.statusCode).toBe(400);
    expect(result.body.message).toMatch(/id is not valid/i);
  });

  it.todo("should return 404 when transaction is not found", async () => {});
  it.todo(
    "should return 500 when DeleteTransactionUseCase throws an unknown error",
    async () => {}
  );
});
