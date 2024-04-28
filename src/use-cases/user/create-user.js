import bcrypt from "bcrypt";
import { EmailAlreadyInUseError } from "../../errors/user.js";

export class CreateUserUseCase {
  constructor(getUserByEmailRepository, createUserRepository) {
    this.getUserByEmailRepository = getUserByEmailRepository;
    this.createUserRepository = createUserRepository;
  }

  async createUser(createUserParams) {
    const isEmailAlreadyInUse =
      await this.getUserByEmailRepository.getUserByEmail(
        createUserParams.email
      );

    if (isEmailAlreadyInUse) {
      throw new EmailAlreadyInUseError(createUserParams.email);
    }

    const { firstName, lastName, email } = createUserParams;

    const hashedPassword = await bcrypt.hash(createUserParams.password, 10);
    const user = {
      firstName,
      lastName,
      email,
      password: hashedPassword
    };

    const createdUser = await this.createUserRepository.createUser(user);
    return createdUser;
  }
}
