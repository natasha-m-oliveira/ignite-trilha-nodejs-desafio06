import { OperationType } from "@modules/statements/entities/Statement";
import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "@modules/users/useCases/createUser/CreateUserUseCase";

import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { CreateTransferError } from "./CreateTransferError";
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

  it("should be able to make a new transfer", async () => {
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

    expect(transferVoucher).toHaveProperty("sender");
    expect(transferVoucher).toHaveProperty("receiver");
    expect(transferVoucher.sender.amount).toBe(transferVoucher.receiver.amount);
  });

  it("should not be able to make a transfer to yourself", async () => {
    const sender = await createUserUseCase.execute({
      email: "we@cira.hu",
      password: "483040",
      name: "Rodney Delgado",
    });

    await createStatementUseCase.execute({
      user_id: sender.id as string,
      type: "deposit" as OperationType,
      amount: 874,
      description: "Payment",
    });

    await expect(
      createTransferUseCase.execute({
        sender_id: sender.id as string,
        receiver_id: sender.id as string,
        amount: 819,
        description: "Transfer",
      })
    ).rejects.toEqual(new CreateTransferError.ReceiverNotfound());
  });

  it("should not be able to transfer an amount negative", async () => {
    await expect(
      createTransferUseCase.execute({
        sender_id: "test" as string,
        receiver_id: "test" as string,
        amount: -5,
        description: "Transfer",
      })
    ).rejects.toEqual(new CreateTransferError.InvalidAmount());
  });

  it("should not be able to transfer an amount greater than the current account balance", async () => {
    const sender = await createUserUseCase.execute({
      email: "sudotej@maf.gy",
      password: "489292",
      name: "Lenora Chapman",
    });

    const receiver = await createUserUseCase.execute({
      email: "socdusit@pa.vi",
      password: "587158",
      name: "Jack Holmes",
    });

    await createStatementUseCase.execute({
      user_id: sender.id as string,
      type: "deposit" as OperationType,
      amount: 594,
      description: "Payment",
    });

    await expect(
      createTransferUseCase.execute({
        sender_id: sender.id as string,
        receiver_id: receiver.id as string,
        amount: 900,
        description: "Transfer",
      })
    ).rejects.toEqual(new CreateTransferError.InsufficientFunds());
  });
});
