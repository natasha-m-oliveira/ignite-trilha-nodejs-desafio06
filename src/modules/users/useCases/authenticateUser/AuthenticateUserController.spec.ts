import request from "supertest";
import { Connection, createConnection } from 'typeorm';
import { app } from '../../../../app';

let connection: Connection;
describe("Authenticate User", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    await request(app).post("/api/v1/users").send({
      email: "john.doe@test.com",
      password: "123",
      name: "John Doe"
    });
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to authenticate an user", async () => {
    const response = await request(app).post("/api/v1/sessions").send({
      email: "john.doe@test.com",
      password: "123"
    });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
  });

  it("should not be able to authenticate an nonexistent user", async () => {
    const response = await request(app).post("/api/v1/sessions").send({
      email: "nonexistent.user@test.com",
      password: "123"
    });
    expect(response.status).toBe(401);
  });

  it("should not be able to authenticate a user with incorrect credentials", async () => {
    const response = await request(app).post("/api/v1/sessions").send({
      email: "john.doe@test.com",
      password: "incorrectPassword"
    });
    expect(response.status).toBe(401);
  });
});
