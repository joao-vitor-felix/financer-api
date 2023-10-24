import { PostgresHelper } from "../../../db/postgres/helper.js";

export class PostgresDeleteUserRepository {
  async deleteUser(id) {
    const userDeleted = await PostgresHelper.query(
      "DELETE FROM users WHERE id = $1 RETURNING *",
      [id]
    );

    return userDeleted?.[0];
  }
}
