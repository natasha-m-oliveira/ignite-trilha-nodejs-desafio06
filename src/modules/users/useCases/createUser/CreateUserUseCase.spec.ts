import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";

let createUserUseCase: CreateUserUseCase;
let usersRepository: InMemoryUsersRepository;

describe("Create User", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepository);
  });

  it("should be able to create a new user", async () => {
    const user = await createUserUseCase.execute({
      email: "divherama@suwleni.ky",
      password: "139326",
      name: "Jean Howell",
    });

    expect(user).toHaveProperty("id");
  });

  it("should not be able to create a new user", async () => {
    await createUserUseCase.execute({
      email: "wul@jop.gp",
      password: "464971",
      name: "Ethel Reid",
    });
    await expect(
      createUserUseCase.execute({
        email: "wul@jop.gp",
        password: "309439",
        name: "Herbert Marsh",
      })
    ).rejects.toBeInstanceOf(CreateUserError);
  });
});
