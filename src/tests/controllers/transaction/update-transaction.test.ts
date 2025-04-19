import { faker } from "@faker-js/faker";
import { Transaction } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import type { Request } from "express";

import { UpdateTransactionController } from "@/controllers";
import { ErrorResponse } from "@/controllers/helpers";
import { UpdateTransactionSchema } from "@/schemas";
import { UpdateTransactionUseCase } from "@/use-cases";

describe("UpdateTransactionController", () => {
  class UpdateTransactionUseCaseStub {
    async execute(
      transactionId: string,
      params: UpdateTransactionSchema
    ): Promise<Transaction> {
      return {
        id: transactionId,
        userId: faker.string.uuid(),
        name: params.name ?? faker.commerce.productName(),
        amount: new Decimal(
          params.amount ??
            faker.number.int({
              min: 5,
              max: 5000
            })
        ),
        date:
          (params.date as unknown as Date) ??
          (faker.date.recent().toString() as unknown as Date),
        type: params.type ?? "EARNING"
      };
    }
  }

  function makeSut() {
    const updateTransactionUseCase =
      new UpdateTransactionUseCaseStub() as UpdateTransactionUseCase;
    const sut = new UpdateTransactionController(updateTransactionUseCase);

    return {
      updateTransactionUseCase,
      sut
    };
  }

  type HttpRequest = Request<
    {
      transactionId: string;
    },
    any,
    UpdateTransactionSchema
  >;

  const httpRequest = {
    params: {
      transactionId: faker.string.uuid()
    },
    body: {
      name: faker.commerce.productName(),
      amount: faker.number.int({
        min: 5,
        max: 5000
      }),
      date: faker.date.recent().toISOString(),
      type: "EARNING"
    }
  } as HttpRequest;

  it("should return 200 alongside updated transaction", async () => {
    const { sut } = makeSut();

    const result = await sut.execute(httpRequest);

    expect(result.statusCode).toBe(200);
    expect(result.body).toEqual<Transaction>({
      id: httpRequest.params.transactionId,
      name: httpRequest.body.name ?? expect.any(String),
      amount:
        (httpRequest.body.amount && new Decimal(httpRequest.body.amount)) ??
        expect.any(Decimal),
      type: httpRequest.body.type ?? expect.any(String),
      date: httpRequest.body.date ?? expect.any(String),
      userId: expect.any(String)
    });
  });

  it("should return 200 when only some fields are provided", async () => {
    const { sut } = makeSut();

    const partialHttpRequest = {
      params: httpRequest.params,
      body: {
        name: "Renda fixa"
      }
    } as HttpRequest;

    const result = await sut.execute(partialHttpRequest);

    expect(result.statusCode).toBe(200);
    expect(result.body).toEqual<Transaction>({
      id: partialHttpRequest.params.transactionId,
      name: partialHttpRequest.body.name ?? expect.any(String),
      amount: expect.any(Decimal),
      type: expect.any(String),
      date: expect.any(String),
      userId: expect.any(String)
    });
  });

  it.todo(
    "should call UpdateTransactionUseCase with correct params",
    async () => {}
  );

  it.todo(
    "should return 400 when transactionId is not a valid transactionId",
    async () => {}
  );

  it.each([
    {
      scenario: "name is not a string",
      httpRequest: {
        params: { ...httpRequest.params },
        body: {
          ...httpRequest.body,
          name: 1
        }
      },
      errorMessage: /must be a string/i
    },
    {
      scenario: "date is not a string",
      httpRequest: {
        params: { ...httpRequest.params },
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
        params: { ...httpRequest.params },
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
        params: { ...httpRequest.params },
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
        params: { ...httpRequest.params },
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
        params: { ...httpRequest.params },
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
        params: { ...httpRequest.params },
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
        httpRequest as Request<any>
      )) as ErrorResponse;
      expect(result.statusCode).toBe(400);
      expect(result.body.message).toMatch(errorMessage);
    }
  );

  it.todo(
    "should return 500 when UpdateTransactionUseCase throws",
    async () => {}
  );
});
