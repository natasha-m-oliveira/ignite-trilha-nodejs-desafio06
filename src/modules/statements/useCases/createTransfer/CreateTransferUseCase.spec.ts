import { OperationType } from "@modules/statements/entities/Statement";
import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "@modules/users/useCases/createUser/CreateUserUseCase";

import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { CreateTransferUseCase } from "./CreateTransferUseCase";

let createStatementUseCase: CreateStatementUseCase;
let statementsRepository: InMemoryStatementsRepository;
let usersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let createTransferUseCase: CreateTransferUseCase;
describe("Create Transfer", () => {
  beforeEach(() => {
    statementsRepository = new InMemoryStatementsRepository();
    usersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepository);
    createTransferUseCase = new CreateTransferUseCase(
      usersRepository,
      statementsRepository
    );
    createStatementUseCase = new CreateStatementUseCase(
      usersRepository,
      statementsRepository
    );
  });
  it("should be able to create a new statement", async () => {
    const sender = await createUserUseCase.execute({
      email: "ifowhi@riz.sd",
      password: "123",
      name: "Virgie Harper",
    });

    const receiver = await createUserUseCase.execute({
      email: "beme@po.ee",
      password: "123",
      name: "Francis Obrien",
    });

    await createStatementUseCase.execute({
      user_id: sender.id as string,
      type: "deposit" as OperationType,
      amount: 502,
      description: "Payment",
    });

    const transferVoucher = await createTransferUseCase.execute({
      sender_id: sender.id as string,
      receiver_id: receiver.id as string,
      amount: 96,
      description: "Transfer",
    });

    expect(transferVoucher).toHaveProperty("receiver");
    expect(transferVoucher).toHaveProperty("sender");
  });
});
