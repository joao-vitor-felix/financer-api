import bcrypt from "bcryptjs";

import { IPasswordHasher } from "./interfaces/password-hasher";

export class PasswordHasherAdapter implements IPasswordHasher {
  async hash(password: string, salt = 10) {
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  }

  async compare(password: string, hashedPassword: string) {
    const isValid = await bcrypt.compare(password, hashedPassword);
    return isValid;
  }
}
