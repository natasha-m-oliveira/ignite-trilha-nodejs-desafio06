import { app } from "@/app";
import request from "supertest";
import { Connection, createConnection } from "typeorm";

let connection: Connection;
describe("Get Balance", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    await request(app).post("/api/v1/users").send({
      email: "miw@re.kr",
      password: "829919",
      name: "Amanda Brock",
    });
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to get balance", async () => {
    const [payment, bills, transfer] = [839, 527, 194];

    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "miw@re.kr",
      password: "829919",
    });

    const token: string = responseToken.body.token;

    const responseReceiver = await request(app).post("/api/v1/users").send({
      email: "bifucmul@wu.md",
      password: "251718",
      name: "Jean Barnett",
    });

    const receiver_id: string = responseReceiver.body.id;

    await request(app)
      .post("/api/v1/statements/deposit")
      .send({
        amount: payment,
        description: "Payment",
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    await request(app)
      .post("/api/v1/statements/withdraw")
      .send({
        amount: bills,
        description: "Bills",
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    await request(app)
      .post(`/api/v1/statements/transfers/${receiver_id}`)
      .send({
        amount: transfer,
        description: "Transfer",
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    const response = await request(app)
      .get("/api/v1/statements/balance")
      .set({
        Authorization: `Bearer ${token}`,
      });

    console.log(response.body);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("statement");
    expect(response.body.statement.length).toBe(3);
    expect(response.body).toHaveProperty("balance");
    expect(response.body.balance).toBe(payment - bills - transfer);
  });

  it("should not be able to get balance with an nonexistent user", async () => {
    const response = await request(app).get("/api/v1/statements/balance").set({
      Authorization: `Bearer invalidToken`,
    });

    expect(response.status).toBe(401);
  });
});
