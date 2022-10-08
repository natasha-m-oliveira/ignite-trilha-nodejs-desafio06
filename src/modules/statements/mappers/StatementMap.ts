/* eslint-disable @typescript-eslint/no-extraneous-class */

import { Statement } from "../entities/Statement";

export class StatementMap {
  static toDTO({
    id,
    receiver_id,
    sender_id,
    amount,
    description,
    type,
    created_at,
    updated_at,
  }: Statement): Omit<Statement, "user_id" | "user"> {
    const statement = {
      id,
      amount: Number(amount / 100),
      description,
      type,
      created_at,
      updated_at,
    };
    if (type === "transfer") {
      Object.assign(statement, {
        receiver_id,
        sender_id,
      });
    }
    return statement;
  }
}
