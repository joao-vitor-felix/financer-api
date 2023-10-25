import { PostgresHelper } from "../../../db/postgres/helper.js";

export class PostgresDeleteTransactionRepository {
  async deleteTransaction(transactionId) {
    const transaction = await PostgresHelper.query(
      "DELETE FROM transactions WHERE id = $1 RETURNING *",
      [transactionId]
    );

    return transaction[0];
  }
}
