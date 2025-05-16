import { UserNotFoundError } from "@/errors";
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

  const id = "any_id";

  it("should retrieve user successfully", async () => {
    const { sut } = makeSut();

    const result = await sut.execute(id);

    expect(result).toEqual({
      id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      hashedPassword: user.hashedPassword
    });
  });

  it("should call GetUserByIdRepository with correct param", async () => {
    const { sut, getUserByIdRepository } = makeSut();
    const spy = vi.spyOn(getUserByIdRepository, "execute");

    await sut.execute(id);

    expect(spy).toHaveBeenCalledOnce();
    expect(spy).toHaveBeenCalledWith(id);
  });

  it("should throw UserNotFoundError if GetUserByIdRepository returns null", async () => {
    const { sut, getUserByIdRepository } = makeSut();
    vi.spyOn(getUserByIdRepository, "execute").mockResolvedValueOnce(null);

    await expect(sut.execute(id)).rejects.toBeInstanceOf(UserNotFoundError);
  });

  it.todo("should throw if GetUserByIdRepository throws", async () => {});
});
