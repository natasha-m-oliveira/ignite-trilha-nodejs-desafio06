import { InMemoryUsersRepository } from '../../repositories/in-memory/InMemoryUsersRepository';
import { CreateUserUseCase } from '../createUser/CreateUserUseCase';
import { AuthenticateUserUseCase } from './AuthenticateUserUseCase'
import { IncorrectEmailOrPasswordError } from './IncorrectEmailOrPasswordError';

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
      email: "john.doe@test.com",
      password: "123",
      name: "John Doe"
    });

    const result = await authenticateUserCase.execute({ email: "john.doe@test.com", password: "123" });

    expect(result).toHaveProperty("token");
  });

  it("should not be able to authenticate an nonexistent user", () => {
    expect(async () => {
      await authenticateUserCase.execute({ email: "john.doe@test.com", password: "123" });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });

  it("should not be able to authenticate a user with incorrect credentials", () => {
    expect(async () => {
      await createUserUseCase.execute({
        email: "john.doe@test.com",
        password: "123",
        name: "John Doe"
      });

      await authenticateUserCase.execute({ email: "john.doe@test.com", password: "incorrectPassword" });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });
})