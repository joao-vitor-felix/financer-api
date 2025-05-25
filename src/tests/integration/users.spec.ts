import { randomUUID } from "node:crypto";

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

    //FIXME: mock is causing the next test to fail
    it.skip("should return 500 when a server error happens", async () => {
      vi.spyOn(prisma.user, "create").mockRejectedValueOnce(new Error());
      const response = await request(app).post("/users").send(user);

      expect(response.statusCode).toBe(500);
      expect(response.body.message).toMatch(/server error/i);
    });
  });

  describe("DELETE /users/:id", () => {
    it("should return 200 when a user is deleted successfully", async () => {
      const { body } = await request(app).post("/users").send(user);
      const response = await request(app).delete(`/users/${body.id}`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({});
    });

    it("should return 404 when the user is not found", async () => {
      const response = await request(app).delete(`/users/${randomUUID()}`);

      expect(response.statusCode).toBe(404);
      expect(response.body.message).toMatch(/not found/i);
    });

    it.todo("should return 500 when a server error happens", async () => {});
  });

  describe("PATCH /users/:id", () => {
    it("should return 200 alongside updated user successfully", async () => {
      const updateParams = {
        firstName: "John Doe",
        email: "john@john.com"
      };

      const { body } = await request(app).post("/users").send(user);
      const response = await request(app)
        .patch(`/users/${body.id}`)
        .send(updateParams);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty("id", body.id);
      expect(response.body).toHaveProperty("firstName", updateParams.firstName);
      expect(response.body).toHaveProperty("email", updateParams.email);
    });

    it("should return 400 when a invalid field is provided", async () => {
      const updateParams = {
        firstName: "John Doe",
        email: "invalid-email"
      };

      const { body } = await request(app).post("/users").send(user);
      const response = await request(app)
        .patch(`/users/${body.id}`)
        .send(updateParams);

      expect(response.statusCode).toBe(400);
      expect(response.body.message).toMatch(/valid/i);
    });

    it("should return 409 when the email is already taken", async () => {
      await request(app)
        .post("/users")
        .send({
          ...user,
          email: "john@doe.com"
        });
      const { body } = await request(app).post("/users").send(user);
      const response = await request(app).patch(`/users/${body.id}`).send({
        email: "john@doe.com"
      });

      expect(response.statusCode).toBe(409);
      expect(response.body.message).toMatch(/already in use/i);
    });

    it("should return 404 when user is not found", async () => {
      const response = await request(app).patch(`/users/${randomUUID()}`).send({
        email: "john@doe.com"
      });

      expect(response.statusCode).toBe(404);
      expect(response.body.message).toMatch(/not found/i);
    });

    it.todo("should return 500 when a server error happens", async () => {});
  });

  describe("GET /users/:id", () => {
    it("should return 200 alongside user", async () => {
      const { body } = await request(app).post("/users").send(user);
      const response = await request(app).get(`/users/${body.id}`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({
        id: body.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      });
    });

    it("should return 400 when user id is invalid", async () => {
      await request(app).post("/users").send(user);
      const response = await request(app).get(`/users/invalid-id`);

      expect(response.statusCode).toBe(400);
      expect(response.body.message).toMatch(/valid/i);
    });

    it("should return 404 when user is not found", async () => {
      const response = await request(app).get(`/users/${randomUUID()}`);

      expect(response.statusCode).toBe(404);
      expect(response.body.message).toMatch(/not found/i);
    });

    it.todo("should return 500 when a server error happens", async () => {});
  });

  describe("GET /users/:id/balance", () => {
    it("should return 200 alongside user balance", async () => {
      const { body } = await request(app).post("/users").send(user);
      const response = await request(app).get(`/users/${body.id}/balance`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty("balance");
      expect(response.body).toHaveProperty("earnings");
      expect(response.body).toHaveProperty("investments");
      expect(response.body).toHaveProperty("expenses");
    });

    it("should return 404 when user is not found", async () => {
      const response = await request(app).get(`/users/${randomUUID()}/balance`);

      expect(response.statusCode).toBe(404);
      expect(response.body.message).toMatch(/not found/i);
    });
  });
});
