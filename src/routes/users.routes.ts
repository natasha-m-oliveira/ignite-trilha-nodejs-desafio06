/* eslint-disable @typescript-eslint/no-misused-promises */
import { CreateUserController } from "@modules/users/useCases/createUser/CreateUserController";
import { Router } from "express";

const usersRouter = Router();
const createUserController = new CreateUserController();

usersRouter.post("/", createUserController.execute);

export { usersRouter };
