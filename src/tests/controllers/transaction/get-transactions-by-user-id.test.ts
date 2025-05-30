import { faker } from "@faker-js/faker";
import { Transaction } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import type { Request } from "express";

import { GetTransactionsByUserIdController } from "@/controllers";
import { ErrorResponse } from "@/controllers/helpers";
import { UserNotFoundError } from "@/errors";
import { GetTransactionsByUserIdUseCase } from "@/use-cases";

describe("GetTransactionsByUserIdController", () => {
  class GetTransactionsByUserIdUseCaseStub {
    async execute(userId: string): Promise<Transaction[]> {
      return [
        {
          id: faker.string.uuid(),
          userId,
          date: faker.date.recent().toISOString() as unknown as Date,
          amount: new Decimal(faker.number.int()),
          name: faker.commerce.productName(),
          type: "EXPENSE"
        },
        {
          id: faker.string.uuid(),
          userId,
          date: faker.date.recent().toISOString() as unknown as Date,
          amount: new Decimal(faker.number.int()),
          name: faker.commerce.productName(),
          type: "EARNING"
        }
      ];
    }
  }

  function makeSut() {
    const getTransactionsByUserIdUseCase =
      new GetTransactionsByUserIdUseCaseStub() as GetTransactionsByUserIdUseCase;
    const sut = new GetTransactionsByUserIdController(
      getTransactionsByUserIdUseCase
    );

    return {
      getTransactionsByUserIdUseCase,
      sut
    };
  }

  const httpRequest = {
    query: {
      userId: faker.string.uuid()
    }
  } as Request<any, any, any, { userId: string }>;

  it("should return 200 alongside user transactions", async () => {
    const { sut } = makeSut();

    const result = await sut.execute(httpRequest);

    expect(result.statusCode).toBe(200);
    expect(result.body).toContainEqual<Transaction>({
      id: expect.any(String),
      userId: expect.any(String),
      date: expect.any(String),
      amount: expect.any(Decimal),
      name: expect.any(String),
      type: expect.any(String)
    });
  });

  it("should call use case with correct params", async () => {
    const { sut, getTransactionsByUserIdUseCase } = makeSut();
    const spy = vi.spyOn(getTransactionsByUserIdUseCase, "execute");

    await sut.execute(httpRequest);

    expect(spy).toHaveBeenCalledOnce();
    expect(spy).toHaveBeenCalledWith(httpRequest.query.userId);
  });

  it("should return 400 if userId is not provided", async () => {
    const { sut } = makeSut();

    const result = (await sut.execute({
      query: {}
    } as Request)) as ErrorResponse;

    expect(result.statusCode).toBe(400);
    expect(result.body.message).toMatch(/userid is required/i);
  });

  it("should return 400 if userId is not a valid id", async () => {
    const { sut } = makeSut();

    const result = (await sut.execute({
      query: {
        userId: "kkkkk"
      }
    } as Request<any, any, any, { userId: string }>)) as ErrorResponse;

    expect(result.statusCode).toBe(400);
    expect(result.body.message).toMatch(/id is not valid/i);
  });

  it("should return 404 if GetTransactionsByUserIdUseCase throws UserNotFoundError", async () => {
    const { sut, getTransactionsByUserIdUseCase } = makeSut();

    vi.spyOn(getTransactionsByUserIdUseCase, "execute").mockRejectedValueOnce(
      new UserNotFoundError(httpRequest.query.userId)
    );

    const result = (await sut.execute(httpRequest)) as ErrorResponse;

    expect(result.statusCode).toBe(404);
    expect(result.body.message).toMatch(/not found/i);
  });

  it("should return 500 if GetTransactionsByUserIdUseCase throws an unknown error", async () => {
    const { sut, getTransactionsByUserIdUseCase } = makeSut();

    vi.spyOn(getTransactionsByUserIdUseCase, "execute").mockRejectedValueOnce(
      new Error("unknown error")
    );

    const result = (await sut.execute(httpRequest)) as ErrorResponse;

    expect(result.statusCode).toBe(500);
    expect(result.body.message).toMatch(/server error/i);
  });
});
