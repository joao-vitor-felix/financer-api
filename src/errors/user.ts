export class EmailAlreadyInUseError extends Error {
  constructor(email: string) {
    super(`The e-mail ${email} is already in use.`);
    this.name = "EmailAlreadyInUseError";
  }
}

export class UserNotFoundError extends Error {
  constructor(userId: string) {
    super(`The user with id ${userId} was not found.`);
    this.name = "UserNotFoundError";
  }
}
