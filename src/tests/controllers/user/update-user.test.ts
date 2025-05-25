import { faker } from "@faker-js/faker";
import { Request } from "express";

import { UpdateUserController } from "@/controllers";
import { ErrorResponse } from "@/controllers/helpers";
import { EmailAlreadyInUseError, UserNotFoundError } from "@/errors/user";
import { UpdateUserUseCase } from "@/use-cases";

describe("UpdateUserController", () => {
  class UpdateUserUseCaseStub {
    constructor() {}

    async execute(userId: string, params: any) {
      return {
        id: userId,
        ...params
      };
    }
  }

  function makeSut() {
    const updateUserUseCase = new UpdateUserUseCaseStub() as UpdateUserUseCase;
    const sut = new UpdateUserController(updateUserUseCase);

    return {
      updateUserUseCase,
      sut
    };
  }

  const httpRequest = {
    params: {
      userId: faker.string.uuid()
    },
    body: {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password({
        length: 6
      })
    }
  } as Request<{ userId: string }>;

  it("should return 200 if user is successfully updated", async () => {
    const { sut } = makeSut();

    const result = await sut.execute(httpRequest);

    expect(result.statusCode).toBe(200);
    expect(result.body).toEqual({
      id: httpRequest.params.userId,
      ...httpRequest.body
    });
  });

  it("should return 200 when only some fields are provided", async () => {
    const { sut } = makeSut();

    const partialHttpRequest = {
      params: {
        userId: httpRequest.params.userId
      },
      body: {
        firstName: "Julia"
      }
    } as Request<{ userId: string }>;

    const result = await sut.execute(partialHttpRequest);

    expect(result.statusCode).toBe(200);
    expect(result.body).toEqual({
      id: partialHttpRequest.params.userId,
      firstName: partialHttpRequest.body.firstName
    });
  });

  it("should call UpdateUserUseCase with correct values", async () => {
    const { sut, updateUserUseCase } = makeSut();
    const spy = vi.spyOn(updateUserUseCase, "execute");

    await sut.execute(httpRequest);

    expect(spy).toHaveBeenCalledWith(
      httpRequest.params.userId,
      httpRequest.body
    );
    expect(spy).toHaveBeenCalledOnce();
  });

  it("should return 400 if an invalid userId is provided", async () => {
    const { sut } = makeSut();

    const result = (await sut.execute({
      params: {
        userId: "invalid-id"
      },
      ...httpRequest.body
    } as Request<{ userId: string }>)) as ErrorResponse;

    expect(result.statusCode).toBe(400);
    expect(result.body.message).toMatch(/not valid/i);
  });

  it.each([
    {
      scenario: "firstName is not a string",
      httpRequest: {
        ...httpRequest,
        body: {
          ...httpRequest.body,
          firstName: 1
        }
      },
      errorMessage: /must be a string/i
    },
    {
      scenario: "firstName is an empty string",
      httpRequest: {
        ...httpRequest,
        body: {
          ...httpRequest.body,
          firstName: ""
        }
      },
      errorMessage: /at least 1 character/i
    },
    {
      scenario: "lastName is not a string",
      httpRequest: {
        ...httpRequest,
        body: {
          ...httpRequest.body,
          lastName: 1
        }
      },
      errorMessage: /must be a string/i
    },
    {
      scenario: "lastName is an empty string",
      httpRequest: {
        ...httpRequest,
        body: {
          ...httpRequest.body,
          lastName: ""
        }
      },
      errorMessage: /at least 1 character/i
    },
    {
      scenario: "email is not a string",
      httpRequest: {
        ...httpRequest,
        body: {
          ...httpRequest.body,
          email: true
        }
      },
      errorMessage: /must be a string/i
    },
    {
      scenario: "email is invalid",
      httpRequest: {
        ...httpRequest,
        body: {
          ...httpRequest.body,
          email: "meu-email"
        }
      },
      errorMessage: /valid email/i
    },
    {
      scenario: "password is not a string",
      httpRequest: {
        ...httpRequest,
        body: {
          ...httpRequest.body,
          password: true
        }
      },
      errorMessage: /must be a string/i
    },
    {
      scenario: "password is less than 6 characters",
      httpRequest: {
        ...httpRequest,
        body: {
          ...httpRequest.body,
          password: faker.internet.password({
            length: 5
          })
        }
      },
      errorMessage: /at least 6 characters/i
    },
    {
      scenario: "provide an unknown field",
      httpRequest: {
        ...httpRequest,
        body: {
          ...httpRequest.body,
          role: "ADMIN"
        }
      },
      errorMessage: /not allowed/i
    }
  ])(
    `should return 400 when $scenario`,
    async ({ httpRequest, errorMessage }) => {
      const { sut } = makeSut();

      const result = (await sut.execute(
        httpRequest as Request<{ userId: string }>
      )) as ErrorResponse;
      expect(result.statusCode).toBe(400);
      expect(result.body.message).toMatch(errorMessage);
    }
  );

  it("should return 409 if UpdateUserUseCase throws an EmailAlreadyInUseError", async () => {
    const { sut, updateUserUseCase } = makeSut();
    vi.spyOn(updateUserUseCase, "execute").mockRejectedValueOnce(
      new EmailAlreadyInUseError(httpRequest.body.email)
    );

    const result = (await sut.execute(httpRequest)) as ErrorResponse;

    expect(result.statusCode).toBe(409);
    expect(result.body.message).toMatch(/already in use/i);
  });

  it("should return 404 if UpdateUserUseCase throws an UserNotFoundError", async () => {
    const { sut, updateUserUseCase } = makeSut();
    vi.spyOn(updateUserUseCase, "execute").mockRejectedValueOnce(
      new UserNotFoundError(httpRequest.params.userId)
    );

    const result = (await sut.execute(httpRequest)) as ErrorResponse;

    expect(result.statusCode).toBe(404);
    expect(result.body.message).toMatch(/not found/i);
  });

  it("should return 500 if UpdateUserUseCase throws an unknown error", async () => {
    const { sut, updateUserUseCase } = makeSut();
    vi.spyOn(updateUserUseCase, "execute").mockRejectedValueOnce(
      new Error("Internal server error")
    );

    const result = (await sut.execute(httpRequest)) as ErrorResponse;

    expect(result.statusCode).toBe(500);
    expect(result.body.message).toMatch(/server error/i);
  });
});
