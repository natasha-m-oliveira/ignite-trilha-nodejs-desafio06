/* eslint-disable @typescript-eslint/no-namespace */

import { AppError } from "@shared/errors/AppError";

export namespace CreateStatementError {
  export class UserNotFound extends AppError {
    constructor() {
      super("User not found", 404);
    }
  }

  export class InvalidAmount extends AppError {
    constructor() {
      super("Invalid amount");
    }
  }

  export class InsufficientFunds extends AppError {
    constructor() {
      super("Insufficient funds");
    }
  }
}
