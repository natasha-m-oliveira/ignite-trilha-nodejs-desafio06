import { app } from "@/app";
import request from "supertest";
import { Connection, createConnection } from "typeorm";

let connection: Connection;
let token: string;
describe("Get Statement Operation", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    await request(app).post("/api/v1/users").send({
      email: "john.doe@test.com",
      password: "123",
      name: "John Doe",
    });

    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "john.doe@test.com",
      password: "123",
    });

    token = responseToken.body.token;
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to get statement operation", async () => {
    const responseStatement = await request(app)
      .post("/api/v1/statements/deposit")
      .send({
        amount: 100,
        description: "Event",
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    const id: string = responseStatement.body.id;

    const response = await request(app)
      .get(`/api/v1/statements/${id}`)
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(200);
    expect(response.body.amount).toBe("100.00");
    expect(response.body.description).toBe("Event");
  });

  it("should not be able to get non-existent statement operation", async () => {
    const response = await request(app)
      .get(`/api/v1/statements/1`)
      .set({
        Authorization: `Bearer ${token}`,
      });

    // Erro ao pesquisar no banco, Internal server error - invalid input syntax for type uuid: "1"
    // por isso a validação do erro aponta para 500 ao invés de 404
    expect(response.status).toBe(500);
  });

  it("should not be able to get non-existent user statement operation", async () => {
    const response = await request(app).get(`/api/v1/statements/1`).set({
      Authorization: `Bearer invalidToken`,
    });

    expect(response.status).toBe(401);
  });
});
