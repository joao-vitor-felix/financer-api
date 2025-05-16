import { user } from "@/tests/fixtures/user";
import { GetUserByIdRepositoryStub } from "@/tests/stubs/GetUserByIdRepositoryStub";
import { GetUserByIdUseCase } from "@/use-cases";

describe("GetUserByIdUseCase", () => {
  function makeSut() {
    const getUserByIdRepository = new GetUserByIdRepositoryStub();
    const sut = new GetUserByIdUseCase(getUserByIdRepository);

    return {
      sut,
      getUserByIdRepository
    };
  }

  it("should retrieve user successfully", async () => {
    const { sut } = makeSut();

    const result = await sut.execute("any_id");

    expect(result).toEqual({
      id: "any_id",
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      hashedPassword: user.hashedPassword
    });
  });

  it.todo(
    "should call GetUserByIdRepository with correct param",
    async () => {}
  );

  it.todo(
    "should throw UserNotFoundError if GetUserByIdRepository returns null",
    async () => {}
  );

  it.todo("should throw if GetUserByIdRepository throws", async () => {});
});
