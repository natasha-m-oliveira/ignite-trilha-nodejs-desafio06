/* eslint-disable @typescript-eslint/no-namespace */

import { AppError } from "@shared/errors/AppError";

export namespace CreateTransferError {
  export class ReceiverNotfound extends AppError {
    constructor() {
      super("Receiver not found", 404);
    }
  }

  export class InsufficientFunds extends AppError {
    constructor() {
      super("Insufficient funds", 400);
    }
  }
}
