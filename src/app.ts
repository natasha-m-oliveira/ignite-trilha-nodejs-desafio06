import "reflect-metadata";
import "express-async-errors";

import createConnection from "@/database";
import cors from "cors";
import * as dotenv from "dotenv";
import express from "express";
import swaggerUi from "swagger-ui-express";

import "@shared/container";
import { AppError } from "@shared/errors/AppError";

import { router } from "./routes";
import swaggerFile from "./swagger.json";

dotenv.config();
void createConnection();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/v1/docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));
app.use("/api/v1", router);

app.use(
  (
    err: Error,
    request: express.Request,
    response: express.Response,
    _next: express.NextFunction
  ) => {
    if (err instanceof AppError) {
      return response.status(err.statusCode).json({
        message: err.message,
      });
    }

    return response.status(500).json({
      status: "error",
      message: `Internal server error - ${err.message} `,
    });
  }
);

export { app };
