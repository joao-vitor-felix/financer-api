import { PostgresHelper } from "../../../db/postgres/helper.js";

export class PostgresGetUserByIdRepository {
  async getUserById(id) {
    const userReturned = await PostgresHelper.query(
      "SELECT * FROM users WHERE id = $1",
      [id]
    );

    return userReturned?.[0];
  }
}
