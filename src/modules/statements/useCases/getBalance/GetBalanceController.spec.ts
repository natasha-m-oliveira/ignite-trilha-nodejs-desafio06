import request from "supertest";
import { Connection, createConnection } from "typeorm";

import { app } from "../../../../app";

let connection: Connection;
describe("Get Balance", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    await request(app).post("/api/v1/users").send({
      email: "john.doe@test.com",
      password: "123",
      name: "John Doe",
    });
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to get balance", async () => {
    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "john.doe@test.com",
      password: "123",
    });

    const token: string = responseToken.body.token;

    await request(app)
      .post("/api/v1/statements/deposit")
      .send({
        amount: 100,
        description: "Event",
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    await request(app)
      .post("/api/v1/statements/withdraw")
      .send({
        amount: 25,
        description: "Bills",
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    const response = await request(app)
      .get("/api/v1/statements/balance")
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("statement");
    expect(response.body.statement.length).toBe(2);
    expect(response.body).toHaveProperty("balance");
    expect(response.body.balance).toBe(75);
  });

  it("should not be able to get balance with an nonexistent user", async () => {
    const response = await request(app).get("/api/v1/statements/balance").set({
      Authorization: `Bearer invalidToken`,
    });

    expect(response.status).toBe(401);
  });
});
