import auth from "@config/auth";
import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";

import { JWTInvalidTokenError } from "@shared/errors/JWTInvalidTokenError";
import { JWTTokenMissingError } from "@shared/errors/JWTTokenMissingError";

interface IPayload {
  sub: string;
}

export async function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new JWTTokenMissingError();
  }

  const [, token] = authHeader.split(" ");

  try {
    const { sub: user_id } = verify(token, auth.jwt.secret) as IPayload;

    request.user = {
      id: user_id,
    };

    next();
  } catch {
    throw new JWTInvalidTokenError();
  }
}
