import { InMemoryUsersRepository } from '../../../users/repositories/in-memory/InMemoryUsersRepository';
import { CreateUserUseCase } from '../../../users/useCases/createUser/CreateUserUseCase';
import { InMemoryStatementsRepository } from '../../repositories/in-memory/InMemoryStatementsRepository';
import { OperationType } from './CreateStatementController';
import { CreateStatementError } from './CreateStatementError';
import { CreateStatementUseCase } from './CreateStatementUseCase';

let createStatementUseCase: CreateStatementUseCase;
let statementsRepository: InMemoryStatementsRepository;
let usersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
describe("Create Statement", () => {
  beforeEach(() => {
    statementsRepository = new InMemoryStatementsRepository();
    usersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepository);
    createStatementUseCase = new CreateStatementUseCase(usersRepository, statementsRepository);
  });

  it("should be able to create a new statement", async () => {
    const user = await createUserUseCase.execute({
      email: "john.doe@test.com",
      password: "123",
      name: "John Doe"
    });

    const statement = await createStatementUseCase.execute({
      user_id: user.id as string,
      type: "deposit" as OperationType,
      amount: 7800,
      description: "Payment"
    });

    expect(statement).toHaveProperty("id");
  });

  it("should not be able to create a new statement", async () => {
    await expect(async () => {
      const user = await createUserUseCase.execute({
        email: "john.doe@test.com",
        password: "123",
        name: "John Doe"
      });

      await createStatementUseCase.execute({
        user_id: user.id as string,
        type: "withdraw" as OperationType,
        amount: 50,
        description: "Withdraw"
      });
    }).rejects.toEqual(new CreateStatementError.InsufficientFunds);
  });

  it("should not be able to create a new statement with an nonexistent user", async () => {
    await expect(async () => {
      await createStatementUseCase.execute({
        user_id: "test",
        type: "deposit" as OperationType,
        amount: 7800,
        description: "Payment"
      });
    }).rejects.toEqual(new CreateStatementError.UserNotFound);
  });
});
