import { app } from "@/app";
import request from "supertest";
import { Connection, createConnection } from "typeorm";

let connection: Connection;
describe("Show User Profile", () => {
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

  it("should be able to show the user's profile", async () => {
    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "john.doe@test.com",
      password: "123",
    });

    const { token } = responseToken.body;
    const response = await request(app)
      .get("/api/v1/profile")
      .set({
        Authorization: `Bearer ${token as string}`,
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id");
    expect(response.body.email).toBe("john.doe@test.com");
  });

  it("should not be able to show the user's profile", async () => {
    const response = await request(app).get("/api/v1/profile");
    expect(response.status).toBe(401);
  });
});
