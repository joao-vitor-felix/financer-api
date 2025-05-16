import { faker } from "@faker-js/faker";

export const user = {
  id: faker.string.uuid(),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  email: faker.internet.email(),
  hashedPassword: faker.string.nanoid()
};
