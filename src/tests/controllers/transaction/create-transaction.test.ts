import { faker } from "@faker-js/faker";
import type { Request } from "express";

import { CreateTransactionController } from "@/controllers";
import { ErrorResponse } from "@/controllers/helpers";
import { CreateTransactionSchema } from "@/schemas";
import { CreateTransactionUseCase } from "@/use-cases";

describe("CreateTransactionController", () => {
  class CreateTransactionUseCaseStub {
    async execute(params: any) {
      return params;
    }
  }

  function makeSut() {
    const createTransactionUseCase =
      new CreateTransactionUseCaseStub() as CreateTransactionUseCase;
    const sut = new CreateTransactionController(createTransactionUseCase);

    return {
      createTransactionUseCase,
      sut
    };
  }

  const httpRequest = {
    body: {
      userId: faker.string.uuid(),
      name: faker.commerce.productName(),
      amount: faker.number.int({
        min: 5,
        max: 5000
      }),
      date: faker.date.recent().toISOString(),
      type: "EXPENSE"
    }
  } as Request<any, any, CreateTransactionSchema>;

  it("should return 200 alongside transaction when successfully created", async () => {
    const { sut } = makeSut();

    const result = await sut.execute(httpRequest);

    expect(result.statusCode).toBe(201);
    expect(result.body).toEqual(httpRequest.body);
  });

  it("should call CreateTransactionUseCase with correct params", async () => {
    const { sut, createTransactionUseCase } = makeSut();
    const spy = vi.spyOn(createTransactionUseCase, "execute");

    await sut.execute(httpRequest);

    expect(spy).toHaveBeenCalledOnce();
    expect(spy).toHaveBeenCalledWith(httpRequest.body);
  });

  it.each([
    {
      scenario: "name is not a string",
      httpRequest: {
        body: {
          ...httpRequest.body,
          name: 1
        }
      },
      errorMessage: /must be a string/i
    },
    {
      scenario: "name is not provided",
      httpRequest: {
        body: {
          ...httpRequest.body,
          name: ""
        }
      },
      errorMessage: /must contain at least 1 character/i
    },
    {
      scenario: "date is not a string",
      httpRequest: {
        body: {
          ...httpRequest.body,
          date: true
        }
      },
      errorMessage: /must be a string/i
    },
    {
      scenario: "date is not valid",
      httpRequest: {
        body: {
          ...httpRequest.body,
          date: "invalid-date"
        }
      },
      errorMessage: /must be a valid date/i
    },
    {
      scenario: "type is not valid",
      httpRequest: {
        body: {
          ...httpRequest.body,
          type: "invalid"
        }
      },
      errorMessage: /must be expense, earning, or investment/i
    },
    {
      scenario: "amount is not a number",
      httpRequest: {
        body: {
          ...httpRequest.body,
          amount: "1"
        }
      },
      errorMessage: /must be a number/i
    },
    {
      scenario: "amount is lower than 1",
      httpRequest: {
        body: {
          ...httpRequest.body,
          amount: 0
        }
      },
      errorMessage: /lower than 1/i
    },
    {
      scenario: "when an unallowed field is provided",
      httpRequest: {
        body: {
          ...httpRequest.body,
          role: "ADMIN"
        }
      },
      errorMessage: /field is not allowed/i
    }
  ])(
    "should return 400 when $scenario",
    async ({ httpRequest, errorMessage }) => {
      const { sut } = makeSut();

      const result = (await sut.execute(
        httpRequest as Request
      )) as ErrorResponse;
      expect(result.statusCode).toBe(400);
      expect(result.body.message).toMatch(errorMessage);
    }
  );

  it("should return 500 when CreateTransactionUseCase throws an unknown error", async () => {
    const { sut, createTransactionUseCase } = makeSut();

    vi.spyOn(createTransactionUseCase, "execute").mockRejectedValueOnce(
      new Error("unknown error")
    );

    const result = (await sut.execute(httpRequest)) as ErrorResponse;

    expect(result.statusCode).toBe(500);
    expect(result.body.message).toMatch(/server error/i);
  });
});
