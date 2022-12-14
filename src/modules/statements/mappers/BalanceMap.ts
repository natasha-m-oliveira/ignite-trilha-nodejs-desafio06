/* eslint-disable @typescript-eslint/no-extraneous-class */

import { Statement } from "../entities/Statement";

interface IRequest {
  statement: Statement[];
  balance: number;
}

interface IBalance {
  statement: Array<Omit<Statement, "user_id" | "user" | "receiver_id">>;
  balance: number;
}

export class BalanceMap {
  static toDTO({ statement, balance }: IRequest): IBalance {
    const parsedStatement = statement.map(
      ({
        id,
        sender_id,
        amount,
        description,
        type,
        created_at,
        updated_at,
      }) => {
        const statement = {
          id,
          amount: Number(amount) / 100,
          description,
          type,
          created_at,
          updated_at,
        };
        if (type === "transfer") {
          Object.assign(statement, {
            sender_id,
          });
        }
        return statement;
      }
    );

    return {
      statement: parsedStatement,
      balance: Number(balance) / 100,
    };
  }
}
