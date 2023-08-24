import { PostgresGetUserById } from "../repositories/postgres/get-user-by-id.js";

export class GetUserByIdUseCase {
  async getUserById(id) {
    const postgresGetUserById = new PostgresGetUserById();
    const userReturned = await postgresGetUserById.getUserById(id);

    return userReturned;
  }
}
