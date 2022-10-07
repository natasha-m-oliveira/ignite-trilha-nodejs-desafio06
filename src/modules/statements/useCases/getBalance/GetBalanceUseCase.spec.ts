import { OperationType } from "@modules/statements/entities/Statement";
import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "@modules/users/useCases/createUser/CreateUserUseCase";

import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { CreateTransferUseCase } from "../createTransfer/CreateTransferUseCase";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

let getBalanceUseCase: GetBalanceUseCase;
let createStatementUseCase: CreateStatementUseCase;
let statementsRepository: InMemoryStatementsRepository;
let usersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let createTransfer: CreateTransferUseCase;
describe("Get Balance", () => {
  beforeEach(() => {
    statementsRepository = new InMemoryStatementsRepository();
    usersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepository);
    createStatementUseCase = new CreateStatementUseCase(
      usersRepository,
      statementsRepository
    );
    createTransfer = new CreateTransferUseCase(
      usersRepository,
      statementsRepository
    );
    getBalanceUseCase = new GetBalanceUseCase(
      statementsRepository,
      usersRepository
    );
  });

  it("should be able to get balance", async () => {
    const [payment, bills, transfer] = [839, 527, 194];

    const user = await createUserUseCase.execute({
      email: "rovepved@alluguh.gn",
      password: "431527",
      name: "Gregory Bridges",
    });

    const receiver = await createUserUseCase.execute({
      email: "zobhade@lo.kp",
      password: "294120",
      name: "Lenora Alvarado",
    });

    await createStatementUseCase.execute({
      user_id: user.id as string,
      type: "deposit" as OperationType,
      amount: payment,
      description: "Payment",
    });

    await createStatementUseCase.execute({
      user_id: user.id as string,
      type: "withdraw" as OperationType,
      amount: bills,
      description: "Bills",
    });

    await createTransfer.execute({
      sender_id: user.id as string,
      receiver_id: receiver.id as string,
      amount: transfer,
      description: "Transfer",
    });

    const balance = await getBalanceUseCase.execute({
      user_id: user.id as string,
    });

    expect(balance).toHaveProperty("statement");
    expect(balance.statement.length).toBe(3);
    expect(balance.balance).toBe(payment - bills - transfer);
  });

  it("should not be able to get balance with an nonexistent user", async () => {
    await expect(
      getBalanceUseCase.execute({ user_id: "test" })
    ).rejects.toBeInstanceOf(GetBalanceError);
  });
});
