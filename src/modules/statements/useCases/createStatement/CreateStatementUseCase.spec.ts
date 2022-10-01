import { InMemoryUsersRepository } from '../../../users/repositories/in-memory/InMemoryUsersRepository';
import { CreateUserUseCase } from '../../../users/useCases/createUser/CreateUserUseCase';
import { InMemoryStatementsRepository } from '../../repositories/in-memory/InMemoryStatementsRepository';
import { OperationType } from './CreateStatementController';
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

    const operationType = "deposit" as OperationType;
    const statement = await createStatementUseCase.execute(
      {
        user_id: user.id as string,
        type: operationType,
        amount: 7800,
        description: "Payment"
      });

    expect(statement).toHaveProperty("id");
  });
})
