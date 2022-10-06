/* eslint-disable @typescript-eslint/no-misused-promises */
import { AuthenticateUserController } from "@modules/users/useCases/authenticateUser/AuthenticateUserController";
import { Router } from "express";

const authenticationRouter = Router();
const authenticateUserController = new AuthenticateUserController();

authenticationRouter.post("/sessions", authenticateUserController.execute);

export { authenticationRouter };
