import { faker } from "@faker-js/faker";
// import { User } from "@prisma/client";
import { Request } from "express";

import { CreateUserController } from "@/controllers";
import { ErrorResponse } from "@/controllers/helpers";
import { EmailAlreadyInUseError } from "@/errors/user";
import { CreateUserSchema } from "@/schemas";
import { User } from "@/types";
import { CreateUserUseCase } from "@/use-cases";

describe("CreateUserController", () => {
  class CreateUserUseCaseStub {
    constructor() {}

    async execute(user: CreateUserSchema): Promise<User> {
      return {
        id: faker.string.uuid(),
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      };
    }
  }

  function makeSut() {
    const createUserUseCase = new CreateUserUseCaseStub() as CreateUserUseCase;
    const sut = new CreateUserController(createUserUseCase);

    return {
      createUserUseCase,
      sut
    };
  }

  const httpRequest = {
    body: {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password({
        length: 6
      })
    }
  } as Request<any, any, CreateUserSchema>;

  it("should create user with valid data", async () => {
    const { sut } = makeSut();

    const result = await sut.execute(httpRequest);

    expect(result.statusCode).toBe(201);
    expect(result.body).toEqual({
      id: expect.any(String),
      firstName: httpRequest.body.firstName,
      lastName: httpRequest.body.lastName,
      email: httpRequest.body.email
    });
  });

  it("should call CreateUserUseCase with correct values", async () => {
    const { sut, createUserUseCase } = makeSut();
    const spy = vi.spyOn(createUserUseCase, "execute");

    await sut.execute(httpRequest);

    expect(spy).toHaveBeenCalledWith(httpRequest.body);
    expect(spy).toHaveBeenCalledOnce();
  });

  it.each([
    {
      scenario: "firstName is not provided",
      body: {
        ...httpRequest.body,
        firstName: ""
      },
      errorMessage: /at least 1 character/i
    },
    {
      scenario: "firstName is not a string",
      body: {
        ...httpRequest.body,
        firstName: {}
      },
      errorMessage: /must be a string/i
    },
    {
      scenario: "lastName is not provided",
      body: {
        ...httpRequest.body,
        lastName: ""
      },
      errorMessage: /at least 1 character/i
    },
    {
      scenario: "lastName is not a string",
      body: {
        ...httpRequest.body,
        lastName: {}
      },
      errorMessage: /must be a string/i
    },
    {
      scenario: "email is not provided",
      body: {
        ...httpRequest.body,
        email: ""
      },
      errorMessage: /valid email/i
    },
    {
      scenario: "email is not valid",
      body: {
        ...httpRequest.body,
        email: "invalid-email"
      },
      errorMessage: /valid email/i
    },
    {
      scenario: "email is not a string",
      body: {
        ...httpRequest.body,
        email: []
      },
      errorMessage: /must be a string/i
    },
    {
      scenario: "password is not provided",
      body: {
        ...httpRequest.body,
        password: ""
      },
      errorMessage: /at least 6 characters/i
    },
    {
      scenario: "password is not valid",
      body: {
        ...httpRequest.body,
        password: "12345"
      },
      errorMessage: /at least 6 characters/i
    },
    {
      scenario: "password is not a string",
      body: {
        ...httpRequest.body,
        password: []
      },
      errorMessage: /must be a string/i
    },
    {
      scenario: "an invalid field is provided",
      body: {
        ...httpRequest.body,
        role: "ADMIN"
      },
      errorMessage: /not allowed/i
    }
  ])(`should return 400 when $scenario`, async ({ body, errorMessage }) => {
    const { sut } = makeSut();
    const result = (await sut.execute({
      body
    } as Request)) as ErrorResponse;

    expect(result.statusCode).toBe(400);
    expect(result.body.message).toMatch(errorMessage);
  });

  it("should return 409 when CreateUserUseCase throws EmailAlreadyInUseError", async () => {
    const { sut, createUserUseCase } = makeSut();
    vi.spyOn(createUserUseCase, "execute").mockRejectedValueOnce(
      new EmailAlreadyInUseError(httpRequest.body.email)
    );

    const result = (await sut.execute(httpRequest)) as ErrorResponse;

    expect(result.statusCode).toBe(409);
    expect(result.body.message).toMatch(/already in use/i);
  });

  it("should return 500 if CreateUserUseCase throws an unknown error", async () => {
    const { sut, createUserUseCase } = makeSut();
    vi.spyOn(createUserUseCase, "execute").mockRejectedValueOnce(
      new Error("Internal server error")
    );

    const result = (await sut.execute(httpRequest)) as ErrorResponse;

    expect(result.statusCode).toBe(500);
    expect(result.body.message).toMatch(/server error/i);
  });
});
