import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";

import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let usersRepository: InMemoryUsersRepository;
let showUserProfileUseCase: ShowUserProfileUseCase;
let createUserUseCase: CreateUserUseCase;

describe("Show User Profile", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    showUserProfileUseCase = new ShowUserProfileUseCase(usersRepository);
    createUserUseCase = new CreateUserUseCase(usersRepository);
  });

  it("should be able to show the user's profile", async () => {
    const user = await createUserUseCase.execute({
      email: "john.doe@test.com",
      password: "123",
      name: "John Doe",
    });

    const result = await showUserProfileUseCase.execute(user.id as string);

    expect(result).toHaveProperty("email");
    expect(result.email).toEqual("john.doe@test.com");
  });

  it("should not be able to show the user's profile", async () => {
    await expect(showUserProfileUseCase.execute("test")).rejects.toBeInstanceOf(
      ShowUserProfileError
    );
  });
});
