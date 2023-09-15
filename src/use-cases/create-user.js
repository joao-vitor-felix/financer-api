import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { PostgresCreateUserRepository } from "../repositories/postgres/create-user.js";
import { PostgresGetUserByEmail } from "../repositories/postgres/get-user-by-email.js";
import { EmailAlreadyInUseError } from "../errors/user.js";

export class CreateUserUseCase {
  async createUser(createUserParams) {
    const postgresGetUserByEmail = new PostgresGetUserByEmail();
    const isEmailAvailable = await postgresGetUserByEmail.getUserByEmail(
      createUserParams.email
    );

    if (isEmailAvailable) {
      throw new EmailAlreadyInUseError(createUserParams.email);
    }

    const userId = uuidv4();
    const hashedPassword = await bcrypt.hash(createUserParams.password, 10);
    const user = {
      ...createUserParams,
      id: userId,
      password: hashedPassword
    };

    const postgresCreateUserRepository = new PostgresCreateUserRepository();
    const createdUser = await postgresCreateUserRepository.createUser(user);
    return createdUser;
  }
}
