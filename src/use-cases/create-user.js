import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { PostgresCreateUserRepository } from "../../repositories/postgres/create-user.js";

export class CreateUserUseCase {
  async createUser(createUserParams) {
    //TODO: verificar se o e-mail já está em uso
    const userId = uuidv4();
    const hashedPassword = await bcrypt.hash(createUserParams.password, 10);
    const user = {
      ...createUserParams,
      ID: userId,
      password: hashedPassword
    };

    const postgresCreateUserRepository = new PostgresCreateUserRepository();
    const createdUser = await postgresCreateUserRepository.createUser(user);
    return createdUser;
  }
}
