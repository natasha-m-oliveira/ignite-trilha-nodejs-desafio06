import { app } from "@/app";
import request from "supertest";
import { Connection, createConnection } from "typeorm";

let connection: Connection;
describe("Create User", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to create a new user", async () => {
    const response = await request(app).post("/api/v1/users").send({
      email: "john.doe@test.com",
      password: "123",
      name: "John Doe",
    });

    expect(response.status).toBe(201);
  });

  it("should not be able to create a new user", async () => {
    const response = await request(app).post("/api/v1/users").send({
      email: "john.doe@test.com",
      password: "123",
      name: "John Doe",
    });

    expect(response.status).toBe(400);
  });
});
