/* eslint-disable @typescript-eslint/no-unused-vars */
import { faker } from "@faker-js/faker";
import { Decimal } from "@prisma/client/runtime/library";
import { Request } from "express";

import { GetUserBalanceController } from "@/controllers";
import { ErrorResponse } from "@/controllers/helpers";
import { UserNotFoundError } from "@/errors/user";
import { Balance } from "@/types";
import { GetUserBalanceUseCase } from "@/use-cases";

describe("GetUserBalanceController", () => {
  class GetUserBalanceUseCaseStub {
    async execute(_userId: string) {
      return {
        earnings: new Decimal(faker.number.int({ min: 1000, max: 2000 })),
        expenses: new Decimal(faker.number.int({ min: 0, max: 1000 })),
        investments: new Decimal(faker.number.int({ min: 0, max: 1000 })),
        balance: new Decimal(faker.number.int({ min: 0, max: 2000 }))
      };
    }
  }

  function makeSut() {
    const getUserBalanceUseCaseStub = new GetUserBalanceUseCaseStub();
    const sut = new GetUserBalanceController(
      getUserBalanceUseCaseStub as GetUserBalanceUseCase
    );

    return {
      getUserBalanceUseCaseStub,
      sut
    };
  }

  const httpRequest = {
    params: {
      userId: faker.string.uuid()
    }
  } as Request<{ userId: string }>;

  it("should return 200 alongside balance if retrieve successfully", async () => {
    const { sut } = makeSut();

    const result = await sut.execute(httpRequest);

    expect(result.statusCode).toBe(200);
    expect(result.body).toEqual<Balance>({
      earnings: expect.any(Decimal),
      expenses: expect.any(Decimal),
      investments: expect.any(Decimal),
      balance: expect.any(Decimal)
    });
  });

  it("should call use case with correct params", async () => {
    const { sut, getUserBalanceUseCaseStub } = makeSut();
    const spy = vi.spyOn(getUserBalanceUseCaseStub, "execute");

    await sut.execute(httpRequest);

    expect(spy).toHaveBeenCalledOnce();
    expect(spy).toHaveBeenCalledWith(httpRequest.params.userId);
  });

  it("should return 400 if userId is not a valid id", async () => {
    const { sut } = makeSut();

    const result = (await sut.execute({
      params: {
        userId: "invalid-id"
      }
    } as Request<{ userId: string }>)) as ErrorResponse;

    expect(result.statusCode).toBe(400);
    expect(result.body.message).toMatch(/not valid/i);
  });

  it("should return 404 if GetUserBalanceUseCase throws UserNotFoundError", async () => {
    const { sut, getUserBalanceUseCaseStub } = makeSut();
    vi.spyOn(getUserBalanceUseCaseStub, "execute").mockRejectedValueOnce(
      new UserNotFoundError(httpRequest.params.userId)
    );

    const result = (await sut.execute(httpRequest)) as ErrorResponse;

    expect(result.statusCode).toBe(404);
    expect(result.body.message).toMatch(/not found/i);
  });

  it("should return 500 if GetUserBalanceUseCase throws an unknown error", async () => {
    const { sut, getUserBalanceUseCaseStub } = makeSut();
    vi.spyOn(getUserBalanceUseCaseStub, "execute").mockRejectedValueOnce(
      new Error("Unknown error")
    );

    const result = (await sut.execute(httpRequest)) as ErrorResponse;

    expect(result.statusCode).toBe(500);
    expect(result.body.message).toMatch(/server error/i);
  });
});
