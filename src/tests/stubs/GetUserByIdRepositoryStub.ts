/* eslint-disable @typescript-eslint/no-unused-vars */
import { faker } from "@faker-js/faker";

export class GetUserByIdRepositoryStub {
  async execute(_id: string): Promise<any> {
    return {
      id: "any_id",
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      hashedPassword: faker.string.nanoid()
    };
  }
}
