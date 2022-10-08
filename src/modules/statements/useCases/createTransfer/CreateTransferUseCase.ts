import {
  OperationType,
  Statement,
} from "@modules/statements/entities/Statement";
import { IStatementsRepository } from "@modules/statements/repositories/IStatementsRepository";
import { IUsersRepository } from "@modules/users/repositories/IUsersRepository";
import { inject, injectable } from "tsyringe";

import { CreateTransferError } from "./CreateTransferError";
import { ICreateTransferDTO } from "./ICreateTransferDTO";

interface IResponse {
  sender: Statement;
  receiver: Statement;
}

@injectable()
export class CreateTransferUseCase {
  constructor(
    @inject("UsersRepository")
    private readonly usersRepository: IUsersRepository,

    @inject("StatementsRepository")
    private readonly statementsRepository: IStatementsRepository
  ) {}

  async execute({
    sender_id,
    receiver_id,
    amount,
    description,
  }: ICreateTransferDTO): Promise<IResponse> {
    if (amount <= 0) {
      throw new CreateTransferError.InvalidAmount();
    }

    const sender = await this.usersRepository.findById(sender_id);

    if (!sender || sender_id === receiver_id) {
      throw new CreateTransferError.ReceiverNotfound();
    }

    const receiver = await this.usersRepository.findById(receiver_id);

    if (!receiver) {
      throw new CreateTransferError.ReceiverNotfound();
    }

    const { balance } = await this.statementsRepository.getUserBalance({
      user_id: sender_id,
    });

    if (balance < amount) {
      throw new CreateTransferError.InsufficientFunds();
    }

    const transferSender = await this.statementsRepository.create({
      user_id: sender_id,
      sender_id,
      receiver_id,
      amount,
      description,
      type: OperationType.TRANSFER,
    });

    const transferReceiver = await this.statementsRepository.create({
      user_id: receiver_id,
      sender_id,
      receiver_id,
      amount,
      description,
      type: OperationType.TRANSFER,
    });

    return {
      sender: transferSender,
      receiver: transferReceiver,
    };
  }
}
