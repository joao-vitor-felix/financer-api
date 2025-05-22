import { faker } from "@faker-js/faker";
import request from "supertest";

import { app } from "@/app";
import { prisma } from "@/lib/client";

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

    it("should return 400 when invalid field is provided", async () => {
      const response = await request(app)
        .post("/users")
        .send({
          ...user,
          email: "invalid-email"
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.message).toMatch(/valid/i);
    });

    it("should return 409 when email already in use is provided", async () => {
      await request(app).post("/users").send(user);
      const response = await request(app).post("/users").send(user);

      expect(response.statusCode).toBe(409);
      expect(response.body.message).toMatch(/already in use/i);
    });

    it("should return 500 when a server error happens", async () => {
      vi.spyOn(prisma.user, "create").mockRejectedValueOnce(new Error());
      const response = await request(app).post("/users").send(user);

      expect(response.statusCode).toBe(500);
      expect(response.body.message).toMatch(/server error/i);
    });
  });
});
