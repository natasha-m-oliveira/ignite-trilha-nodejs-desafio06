/* eslint-disable @typescript-eslint/no-extraneous-class */

import { Statement } from "../entities/Statement";

interface IRequest {
  statement: Statement[];
  balance: number;
}

interface IBalance {
  statement: Array<Omit<Statement, "user_id" | "user">>;
  balance: number;
}

export class BalanceMap {
  static toDTO({ statement, balance }: IRequest): IBalance {
    const parsedStatement = statement.map(
      ({ id, amount, description, type, created_at, updated_at }) => ({
        id,
        amount: Number(amount),
        description,
        type,
        created_at,
        updated_at,
      })
    );

    return {
      statement: parsedStatement,
      balance: Number(balance),
    };
  }
}
