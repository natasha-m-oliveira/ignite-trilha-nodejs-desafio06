import { app } from "@/app";
import request from "supertest";
import { Connection, createConnection } from "typeorm";

let connection: Connection;
describe("Show User Profile", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    await request(app).post("/api/v1/users").send({
      email: "orahifoj@hahetki.gq",
      password: "539592",
      name: "Sue Hughes",
    });
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to show the user's profile", async () => {
    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "orahifoj@hahetki.gq",
      password: "539592",
    });

    const { token } = responseToken.body;
    const response = await request(app)
      .get("/api/v1/profile")
      .set({
        Authorization: `Bearer ${token as string}`,
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id");
    expect(response.body.email).toBe("orahifoj@hahetki.gq");
  });

  it("should not be able to show the user's profile", async () => {
    const response = await request(app).get("/api/v1/profile");
    expect(response.status).toBe(401);
  });
});
