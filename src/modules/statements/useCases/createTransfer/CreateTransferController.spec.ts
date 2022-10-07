import { app } from "@/app";
import request from "supertest";
import { Connection, createConnection } from "typeorm";

let connection: Connection;
let token: string;
let user_id: string;
describe("Create Transfer", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    await request(app).post("/api/v1/users").send({
      email: "kuila@sug.ru",
      password: "123",
      name: "Theresa Jacobs",
    });

    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "kuila@sug.ru",
      password: "123",
    });

    token = responseToken.body.token;
    user_id = responseToken.body.user.id;
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to make a new transfer", async () => {
    await request(app)
      .post("/api/v1/statements/deposit")
      .send({
        amount: 994,
        description: "Event",
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    const responseReceiver = await request(app).post("/api/v1/users").send({
      email: "fo@padgorim.la",
      password: "561810",
      name: "Samuel Reid",
    });
    const receiver_id: string = responseReceiver.body.id;

    const response = await request(app)
      .post(`/api/v1/statements/transfers/${receiver_id}`)
      .send({
        amount: 521,
        description: "Transfer",
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(201);
    expect(response.body.receiver_id).toBe(receiver_id);
    expect(response.body.amount).toBe(521);
  });

  it("should not be able to make a transfer to yourself", async () => {
    const response = await request(app)
      .post(`/api/v1/statements/transfers/${user_id}`)
      .send({
        amount: 76,
        description: "Transfer",
      })
      .set({
        Authorization: `Bearer ${token}`,
      });
    expect(response.status).toBe(404);
  });

  it("should not be able to transfer an amount greater than the current account balance", async () => {
    const responseReceiver = await request(app).post("/api/v1/users").send({
      email: "zi@hunbipgo.cy",
      password: "416626",
      name: "Alma Becker",
    });

    const receiver_id: string = responseReceiver.body.id;

    const response = await request(app)
      .post(`/api/v1/statements/transfers/${receiver_id}`)
      .send({
        amount: 1200,
        description: "Transfer",
      })
      .set({
        Authorization: `Bearer ${token}`,
      });
    expect(response.status).toBe(400);
  });
});
