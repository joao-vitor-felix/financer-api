/* eslint-disable @typescript-eslint/no-unused-vars */
import { faker } from "@faker-js/faker";
import { Request } from "express";

import { DeleteUserController } from "@/controllers";
import { ErrorResponse } from "@/controllers/helpers";
import { UserNotFoundError } from "@/errors/user";
import { DeleteUserUseCase } from "@/use-cases";

describe("DeleteUserController", () => {
  class DeleteUserUseCaseStub {
    async execute(_userId: string) {
      return;
    }
  }

  function makeSut() {
    const deleteUserUseCaseStub = new DeleteUserUseCaseStub();
    const sut = new DeleteUserController(
      deleteUserUseCaseStub as DeleteUserUseCase
    );

    return {
      deleteUserUseCaseStub,
      sut
    };
  }

  const httpRequest = {
    params: {
      userId: faker.string.uuid()
    }
  } as Request<{ userId: string }>;

  it("should return 200 when user is deleted successfully", async () => {
    const { sut } = makeSut();

    const result = await sut.execute(httpRequest);

    expect(result.statusCode).toBe(200);
  });

  it("should return 400 when userId is not valid", async () => {
    const { sut } = makeSut();

    const result = (await sut.execute({
      params: {
        userId: "invalid-id"
      }
    } as Request<{ userId: string }>)) as ErrorResponse;

    expect(result.statusCode).toBe(400);
    expect(result.body.message).toMatch(/not valid/i);
  });

  it("should return 404 when DeleteUserUseCase throws UserNotFoundError", async () => {
    const { sut, deleteUserUseCaseStub } = makeSut();
    vi.spyOn(deleteUserUseCaseStub, "execute").mockRejectedValueOnce(
      new UserNotFoundError(httpRequest.params.userId)
    );

    const result = (await sut.execute(httpRequest)) as ErrorResponse;

    expect(result.statusCode).toBe(404);
    expect(result.body.message).toMatch(/not found/i);
  });

  it("should return 500 when DeleteUserUseCase throws an unknown error", async () => {
    const { sut, deleteUserUseCaseStub } = makeSut();
    vi.spyOn(deleteUserUseCaseStub, "execute").mockRejectedValueOnce(
      new Error("Server error")
    );

    const result = (await sut.execute(httpRequest)) as ErrorResponse;

    expect(result.statusCode).toBe(500);
    expect(result.body.message).toMatch(/server error/i);
  });
});
