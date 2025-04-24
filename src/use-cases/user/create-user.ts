import { PasswordHasherAdapter } from "@/adapters";
import { EmailAlreadyInUseError } from "@/errors/user";
import { CreateUserSchema } from "@/schemas";
import { ICreateUserRepository, IGetUserByEmailRepository } from "@/types";

export class CreateUserUseCase {
  constructor(
    private getUserByEmailRepository: IGetUserByEmailRepository,
    private createUserRepository: ICreateUserRepository,
    private passwordHasherAdapter: PasswordHasherAdapter
  ) {}

  async execute(params: CreateUserSchema) {
    const isEmailAlreadyInUse = await this.getUserByEmailRepository.execute(
      params.email
    );

    if (isEmailAlreadyInUse) {
      throw new EmailAlreadyInUseError(params.email);
    }

    const { firstName, lastName, email, password } = params;
    const hashedPassword = await this.passwordHasherAdapter.hash(password);

    const userParams = {
      firstName,
      lastName,
      email,
      hashedPassword
    };

    const user = await this.createUserRepository.execute(userParams);
    return user;
  }
}
