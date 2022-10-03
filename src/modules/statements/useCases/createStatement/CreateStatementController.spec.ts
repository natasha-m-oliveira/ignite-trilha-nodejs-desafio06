import request from "supertest";
import { Connection, createConnection } from 'typeorm';
import { app } from '../../../../app';

let connection: Connection;
let token: string;
describe("Create Statement", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    await request(app).post("/api/v1/users").send({
      email: "john.doe@test.com",
      password: "123",
      name: "John Doe"
    });

    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "john.doe@test.com",
      password: "123"
    });

    token = responseToken.body.token;
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to create a new deposit statement", async () => {
    const response = await request(app)
      .post("/api/v1/statements/deposit")
      .send({
        amount: 100,
        description: "Event"
      }).set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("amount");
    expect(response.body.amount).toBe(100);
  });

  it("should be able to create a new withdraw statement", async () => {
    const response = await request(app)
      .post("/api/v1/statements/withdraw")
      .send({
        amount: 25,
        description: "Bills"
      }).set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("amount");
    expect(response.body.amount).toBe(25);
  });

  it("should not be able to create a new withdraw statement", async () => {
    const response = await request(app)
      .post("/api/v1/statements/withdraw")
      .send({
        amount: 80,
        description: "Bills"
      }).set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(400);
  });

  it("should not be able to create a new statement with an nonexistent user", async () => {
    const response = await request(app)
      .post("/api/v1/statements/deposit")
      .send({
        amount: 100,
        description: "Event"
      }).set({
        Authorization: `Bearer invalidToken`,
      });

    expect(response.status).toBe(401);
  });
});
