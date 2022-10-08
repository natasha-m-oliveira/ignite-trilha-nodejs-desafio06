import { app } from "@/app";
import request from "supertest";
import { Connection, createConnection } from "typeorm";

let connection: Connection;
let token: string;
describe("Create Statement", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    await request(app).post("/api/v1/users").send({
      email: "dac@kilugsi.so",
      password: "419224",
      name: "Justin Kelley",
    });

    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "dac@kilugsi.so",
      password: "419224",
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
        description: "Event",
      })
      .set({
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
        description: "Bills",
      })
      .set({
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
        description: "Bills",
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(400);
  });

  it("should not be able to create a new statement with an amount negative", async () => {
    const response = await request(app)
      .post("/api/v1/statements/withdraw")
      .send({
        amount: -685,
        description: "Withdraw",
      })
      .set({
        Authorization: `Bearer ${token}`,
      });
    expect(response.status).toBe(400);
  });

  it("should not be able to create a new statement with an nonexistent user", async () => {
    const response = await request(app)
      .post("/api/v1/statements/deposit")
      .send({
        amount: 100,
        description: "Event",
      })
      .set({
        Authorization: `Bearer invalidToken`,
      });

    expect(response.status).toBe(401);
  });
});
