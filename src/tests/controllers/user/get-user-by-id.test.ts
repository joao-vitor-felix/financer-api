import { faker } from "@faker-js/faker";
import { Request } from "express";

import { GetUserByIdController } from "@/controllers";
import { ErrorResponse } from "@/controllers/helpers";
import { UserNotFoundError } from "@/errors/user";
import { User } from "@/types";
import { GetUserByIdUseCase } from "@/use-cases";

describe("GetUserByIdController", () => {
  class GetUserByIdUseCaseStub {
    constructor() {}

    async execute(userId: string): Promise<User> {
      return {
        id: userId,
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email()
      };
    }
  }

  function makeSut() {
    const getUserByIdUseCase =
      new GetUserByIdUseCaseStub() as GetUserByIdUseCase;
    const sut = new GetUserByIdController(getUserByIdUseCase);

    return {
      getUserByIdUseCase,
      sut
    };
  }

  const httpRequest = {
    params: {
      userId: faker.string.uuid()
    }
  } as Request<{ userId: string }>;

  it("should return 200 alongside user successfully", async () => {
    const { sut } = makeSut();

    const result = await sut.execute(httpRequest);

    expect(result.statusCode).toBe(200);
    expect(result.body).toEqual<User>({
      id: httpRequest.params.userId,
      firstName: expect.any(String),
      lastName: expect.any(String),
      email: expect.any(String)
    });
  });

  it("should call use case with correct params", async () => {
    const { sut, getUserByIdUseCase } = makeSut();
    const spy = vi.spyOn(getUserByIdUseCase, "execute");

    await sut.execute(httpRequest);

    expect(spy).toHaveBeenCalledOnce();
    expect(spy).toHaveBeenCalledWith(httpRequest.params.userId);
  });

  it("should return 400 when userId is not valid", async () => {
    const { sut } = makeSut();

    const result = (await sut.execute({
      params: {
        userId: ""
      }
    } as Request<{ userId: string }>)) as ErrorResponse;

    expect(result.statusCode).toBe(400);
    expect(result.body.message).toMatch(/not valid/i);
  });

  it("should return 404 when GetUserByIdUseCase throws UserNotFoundError", async () => {
    const { sut, getUserByIdUseCase } = makeSut();
    vi.spyOn(getUserByIdUseCase, "execute").mockRejectedValueOnce(
      new UserNotFoundError(httpRequest.params.userId)
    );

    const result = (await sut.execute(httpRequest)) as ErrorResponse;

    expect(result.statusCode).toBe(404);
    expect(result.body.message).toMatch(/not found/i);
  });

  it("should return 500 when GetUserByIdUseCase throws an unknown error", async () => {
    const { sut, getUserByIdUseCase } = makeSut();
    vi.spyOn(getUserByIdUseCase, "execute").mockRejectedValueOnce(
      new Error("Internal server error")
    );

    const result = (await sut.execute(httpRequest)) as ErrorResponse;

    expect(result.statusCode).toBe(500);
    expect(result.body.message).toMatch(/server error/i);
  });
});
