import { faker } from "@faker-js/faker";
import request from "supertest";

import { app } from "@/app";

const user = {
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  email: faker.internet.email(),
  password: faker.internet.password({
    length: 6
  })
};

describe("Users integration tests", () => {
  describe("POST /users", () => {
    it("should return 201 alongside user", async () => {
      const response = await request(app).post("/users").send(user);

      expect(response.statusCode).toBe(201);
      expect(response.body).toEqual({
        id: expect.any(String),
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      });
    });
  });
});
