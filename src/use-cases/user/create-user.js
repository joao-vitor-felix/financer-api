import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
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

    const userId = uuidv4();
    const hashedPassword = await bcrypt.hash(createUserParams.password, 10);
    const user = {
      ...createUserParams,
      id: userId,
      password: hashedPassword
    };

    const createdUser = await this.createUserRepository.createUser(user);
    return createdUser;
  }
}
