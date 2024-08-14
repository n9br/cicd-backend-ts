import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import AccessTokens from "../services/auth/AccessToken";

interface AuthenticatedRequest extends Request {
  user?: { userId: number };
}

function authMiddleWare(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Response | void {
  const token = req.headers["x-access-token"] as string | undefined;

  if (!token) {
    return res.status(StatusCodes.FORBIDDEN).send("No Token provided!");
  }

  try {
    const decodedAccessToken = AccessTokens.decodeAccessToken(token);
    req.user = decodedAccessToken; // Assuming { userId: number } is the structure of the decoded token
  } catch (e) {
    return res
      .status(StatusCodes.FORBIDDEN)
      .send("Something is wrong with your token");
  }

  return next();
}

export default authMiddleWare;
