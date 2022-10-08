import { StatementMap } from "@modules/statements/mappers/StatementMap";
import { Request, Response } from "express";
import { container } from "tsyringe";

import { CreateStatementUseCase } from "./CreateStatementUseCase";

enum OperationType {
  DEPOSIT = "deposit",
  WITHDRAW = "withdraw",
}

export class CreateStatementController {
  async execute(request: Request, response: Response): Promise<Response> {
    const { id: user_id } = request.user;
    const { amount, description } = request.body;

    const splittedPath = request.originalUrl.split("/");
    const type = splittedPath[splittedPath.length - 1] as OperationType;

    const createStatement = container.resolve(CreateStatementUseCase);

    const statement = await createStatement.execute({
      user_id,
      type,
      amount: Number(amount) * 100,
      description,
    });

    const statementDTO = StatementMap.toDTO(statement);

    return response.status(201).json(statementDTO);
  }
}
