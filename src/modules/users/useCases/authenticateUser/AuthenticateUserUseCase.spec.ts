import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";

import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let authenticateUserCase: AuthenticateUserUseCase;
let usersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Authenticate User", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    authenticateUserCase = new AuthenticateUserUseCase(usersRepository);
    createUserUseCase = new CreateUserUseCase(usersRepository);
  });

  it("should be able to authenticate an user", async () => {
    await createUserUseCase.execute({
      email: "gabo@ciere.nr",
      password: "065361",
      name: "Harry Bowers",
    });

    const result = await authenticateUserCase.execute({
      email: "gabo@ciere.nr",
      password: "065361",
    });

    expect(result).toHaveProperty("token");
  });

  it("should not be able to authenticate an nonexistent user", async () => {
    await expect(
      authenticateUserCase.execute({
        email: "ajruloh@fudgij.mr",
        password: "570308",
      })
    ).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });

  it("should not be able to authenticate a user with incorrect credentials", async () => {
    await createUserUseCase.execute({
      email: "lictajos@lajara.sn",
      password: "163688",
      name: "Stephen Figueroa",
    });
    await expect(
      authenticateUserCase.execute({
        email: "lictajos@lajara.sn",
        password: "incorrectPassword",
      })
    ).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });
});
