import { InMemoryUsersRepository } from '../../../users/repositories/in-memory/InMemoryUsersRepository';
import { CreateUserUseCase } from '../../../users/useCases/createUser/CreateUserUseCase';
import { InMemoryStatementsRepository } from '../../repositories/in-memory/InMemoryStatementsRepository';
import { OperationType } from '../createStatement/CreateStatementController';
import { CreateStatementUseCase } from '../createStatement/CreateStatementUseCase';
import { GetStatementOperationError } from './GetStatementOperationError';
import { GetStatementOperationUseCase } from './GetStatementOperationUseCase';

let createStatementUseCase: CreateStatementUseCase;
let statementsRepository: InMemoryStatementsRepository;
let usersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let getStatementOperationUseCase: GetStatementOperationUseCase;
describe("Get Statement Operation", () => {
  beforeEach(() => {
    statementsRepository = new InMemoryStatementsRepository();
    usersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepository);
    createStatementUseCase = new CreateStatementUseCase(usersRepository, statementsRepository);
    getStatementOperationUseCase = new GetStatementOperationUseCase(usersRepository, statementsRepository);
  });

  it("should be able to get statement operation", async () => {
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

    const operation = await getStatementOperationUseCase.execute({
      user_id: user.id as string,
      statement_id: statement.id as string
    });

    expect(operation).toEqual(statement);
  });

  it("should not be able to get non-existent statement operation", async () => {
    await expect(async () => {
      const user = await createUserUseCase.execute({
        email: "john.doe@test.com",
        password: "123",
        name: "John Doe"
      });

      await getStatementOperationUseCase.execute({
        user_id: user.id as string,
        statement_id: "test"
      });
    }).rejects.toEqual(new GetStatementOperationError.StatementNotFound);
  });

  it("should not be able to get non-existent user statement operation", async () => {
    await expect(async () => {
      await getStatementOperationUseCase.execute({
        user_id: "test",
        statement_id: "test"
      });
    }).rejects.toEqual(new GetStatementOperationError.UserNotFound);
  });
});
