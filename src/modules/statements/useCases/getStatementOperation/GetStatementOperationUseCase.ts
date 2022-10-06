import { Statement } from "@modules/statements/entities/Statement";
import { IStatementsRepository } from "@modules/statements/repositories/IStatementsRepository";
import { IUsersRepository } from "@modules/users/repositories/IUsersRepository";
import { inject, injectable } from "tsyringe";

import { GetStatementOperationError } from "./GetStatementOperationError";

interface IRequest {
  user_id: string;
  statement_id: string;
}

@injectable()
export class GetStatementOperationUseCase {
  constructor(
    @inject("UsersRepository")
    private readonly usersRepository: IUsersRepository,

    @inject("StatementsRepository")
    private readonly statementsRepository: IStatementsRepository
  ) {}

  async execute({ user_id, statement_id }: IRequest): Promise<Statement> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new GetStatementOperationError.UserNotFound();
    }

    const statementOperation =
      await this.statementsRepository.findStatementOperation({
        user_id,
        statement_id,
      });

    if (!statementOperation) {
      throw new GetStatementOperationError.StatementNotFound();
    }

    return statementOperation;
  }
}
