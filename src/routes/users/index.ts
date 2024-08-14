import { Router, Request, Response } from "express";
import { StatusCodes, ReasonPhrases } from "http-status-codes";
import UserModel from "../../database/models/UserModel";
import logger from "../../services/logger/Logger";

const UserRouter = Router();

// Custom Request Interface
interface AuthenticatedRequest extends Request {
  user?: { userId: number };
}

// GET REQUESTS
UserRouter.get(
  "/currentuser",
  async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?.userId;

    if (!userId) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .send(ReasonPhrases.UNAUTHORIZED);
    }

    try {
      const user = await UserModel.findOne({ where: { id: userId } });
      logger.info("You have a new user", { userId });

      if (!user) {
        res.status(StatusCodes.NOT_FOUND).send(ReasonPhrases.NOT_FOUND);
        return;
      }

      res.status(StatusCodes.OK).json({ user });
    } catch (error) {
      logger.error("Error fetching user", { userId, error });
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send(ReasonPhrases.INTERNAL_SERVER_ERROR);
    }
  }
);

export { UserRouter };
