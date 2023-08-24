import { PostgresHelper } from "../../db/postgres/helper.js";

export class PostgresGetUserByEmail {
  async getUserByEmail(email) {
    const userReturned = await PostgresHelper.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    return userReturned?.[0];
  }
}
