import { PostgresGetUserByIdRepository } from "../repositories/postgres/index.js";

export class GetUserByIdUseCase {
  async getUserById(id) {
    const postgresGetUserById = new PostgresGetUserByIdRepository();
    const userReturned = await postgresGetUserById.getUserById(id);

    return userReturned;
  }
}
