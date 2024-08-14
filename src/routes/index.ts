import { Router, Request, Response } from "express";
import { TodosRouter } from "./todos";
import { AuthRouter } from "./auth";
import { UserRouter } from "./users";
import authMiddleWare from "../middlewares/authMiddleware";
import logger from "../services/logger/Logger";

const AppRouter = Router();

AppRouter.use("/auth", AuthRouter);
AppRouter.use("/users", authMiddleWare, UserRouter);
AppRouter.use("/todos", TodosRouter);

AppRouter.get("/test", (req: Request, res: Response) => {
  console.log("Hello World");
  logger.error("Hello World");
  res.json({ myLogLevel: process.env.LOG_LEVEL });
});

export { AppRouter };
