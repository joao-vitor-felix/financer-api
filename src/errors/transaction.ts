export class TransactionNotFoundError extends Error {
  constructor() {
    super(`The transaction was not found`);
    this.name = "TransactionNotFoundError";
  }
}
