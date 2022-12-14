import { StatementMap } from "@modules/statements/mappers/StatementMap";
import { Request, Response } from "express";
import { container } from "tsyringe";

import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

export class GetStatementOperationController {
  async execute(request: Request, response: Response): Promise<Response> {
    const { id: user_id } = request.user;
    const { statement_id } = request.params;

    const getStatementOperation = container.resolve(
      GetStatementOperationUseCase
    );

    const statementOperation = await getStatementOperation.execute({
      user_id,
      statement_id,
    });

    const statementDTO = StatementMap.toDTO(statementOperation);

    return response.json(statementDTO);
  }
}
