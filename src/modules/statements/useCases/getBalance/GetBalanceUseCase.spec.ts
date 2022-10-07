import { OperationType } from "@modules/statements/entities/Statement";
import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "@modules/users/useCases/createUser/CreateUserUseCase";

import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

let getBalanceUseCase: GetBalanceUseCase;
let createStatementUseCase: CreateStatementUseCase;
let statementsRepository: InMemoryStatementsRepository;
let usersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
describe("Get Balance", () => {
  beforeEach(() => {
    statementsRepository = new InMemoryStatementsRepository();
    usersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepository);
    createStatementUseCase = new CreateStatementUseCase(
      usersRepository,
      statementsRepository
    );
    getBalanceUseCase = new GetBalanceUseCase(
      statementsRepository,
      usersRepository
    );
  });

  it("should be able to get balance", async () => {
    const user = await createUserUseCase.execute({
      email: "john.doe@test.com",
      password: "123",
      name: "John Doe",
    });

    await createStatementUseCase.execute({
      user_id: user.id as string,
      type: "deposit" as OperationType,
      amount: 7800,
      description: "Payment",
    });

    const balance = await getBalanceUseCase.execute({
      user_id: user.id as string,
    });

    expect(balance).toHaveProperty("statement");
    expect(balance.statement.length).toBe(1);
    expect(balance.balance).toBe(7800);
  });

  it("should not be able to get balance with an nonexistent user", async () => {
    await expect(
      getBalanceUseCase.execute({ user_id: "test" })
    ).rejects.toBeInstanceOf(GetBalanceError);
  });
});
