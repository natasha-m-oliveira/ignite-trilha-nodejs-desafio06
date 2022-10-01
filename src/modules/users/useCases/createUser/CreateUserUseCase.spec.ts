import { InMemoryUsersRepository } from '../../repositories/in-memory/InMemoryUsersRepository';
import { CreateUserError } from './CreateUserError';
import { CreateUserUseCase } from './CreateUserUseCase'

let createUserUseCase: CreateUserUseCase;
let usersRepository: InMemoryUsersRepository;

describe("Create User", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepository);
  });

  it("should be able to create a new user", async () => {
    const user = await createUserUseCase.execute({
      email: "john.doe@test.com",
      password: "123",
      name: "John Doe"
    });

    expect(user).toHaveProperty("id");
  });

  it("should not be able to create a new user", () => {
    expect(async () => {
      await createUserUseCase.execute({
        email: "john.doe@test.com",
        password: "123",
        name: "John Doe"
      });
      await createUserUseCase.execute({
        email: "john.doe@test.com",
        password: "123",
        name: "John Doe2"
      });
    }).rejects.toBeInstanceOf(CreateUserError);
  });
})
