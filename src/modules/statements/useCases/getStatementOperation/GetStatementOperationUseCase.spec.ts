import { OperationType } from "@modules/statements/entities/Statement";
import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "@modules/users/useCases/createUser/CreateUserUseCase";

import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

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
    createStatementUseCase = new CreateStatementUseCase(
      usersRepository,
      statementsRepository
    );
    getStatementOperationUseCase = new GetStatementOperationUseCase(
      usersRepository,
      statementsRepository
    );
  });

  it("should be able to get statement operation", async () => {
    const user = await createUserUseCase.execute({
      email: "mekwo@ovin.ne",
      password: "938470",
      name: "Etta Lloyd",
    });

    const statement = await createStatementUseCase.execute({
      user_id: user.id as string,
      type: "deposit" as OperationType,
      amount: 956,
      description: "Payment",
    });

    const operation = await getStatementOperationUseCase.execute({
      user_id: user.id as string,
      statement_id: statement.id as string,
    });

    expect(operation).toEqual(statement);
  });

  it("should not be able to get non-existent statement operation", async () => {
    const user = await createUserUseCase.execute({
      email: "er@pokor.cx",
      password: "678049",
      name: "Myrtie Jefferson",
    });
    await expect(
      getStatementOperationUseCase.execute({
        user_id: user.id as string,
        statement_id: "test",
      })
    ).rejects.toEqual(new GetStatementOperationError.StatementNotFound());
  });

  it("should not be able to get non-existent user statement operation", async () => {
    await expect(
      getStatementOperationUseCase.execute({
        user_id: "test",
        statement_id: "test",
      })
    ).rejects.toEqual(new GetStatementOperationError.UserNotFound());
  });
});
