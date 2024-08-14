import { Router, Request, Response } from "express";
import { StatusCodes, ReasonPhrases } from "http-status-codes";
import TodoModel from "../../database/models/TodoModel";
import UserModel from "../../database/models/UserModel";
import AccessTokens from "../../services/auth/AccessToken";
import bcrypt from "bcrypt";

const AuthRouter = Router();

// Define custom request interfaces for login and signup
interface LoginRequest extends Request {
  body: {
    email: string;
    password: string;
  };
}

interface SignupRequest extends Request {
  body: {
    email: string;
    password: string;
    name: string;
    profileImgUrl?: string; // Optional if added later
  };
}

// POST REQUESTS

AuthRouter.post("/login", async (req: LoginRequest, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(StatusCodes.BAD_REQUEST).send(ReasonPhrases.BAD_REQUEST);
    return;
  }

  try {
    const user = await UserModel.scope("allData").findOne({ where: { email } });

    if (!user) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .send(ReasonPhrases.BAD_REQUEST);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .send(ReasonPhrases.UNAUTHORIZED);
    }

    user.password = null; // TypeScript might require an explicit `as any` or `as unknown` here

    const myToken = AccessTokens.createAccessToken(user.id);

    // Set token in response header as an HTTP-only cookie
    res.cookie("token", myToken, {
      httpOnly: true,
      // secure: true,
      // maxAge: 100000,
      // signed: true,
    });

    res.status(StatusCodes.OK).json({ user, tokens: { accessToken: myToken } });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send(ReasonPhrases.INTERNAL_SERVER_ERROR);
  }
});

AuthRouter.post("/signup", async (req: SignupRequest, res: Response) => {
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    res.status(StatusCodes.BAD_REQUEST).send(ReasonPhrases.BAD_REQUEST);
    return;
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await UserModel.create({
      email,
      password: hashedPassword,
      name,
    });

    newUser.password = null; // TypeScript might require an explicit `as any` or `as unknown` here

    const myToken = AccessTokens.createAccessToken(newUser.id);

    // Set token in response header as an HTTP-only cookie
    res.cookie("token", myToken, {
      httpOnly: true,
      // secure: true,
      // maxAge: 100000,
      // signed: true,
    });

    res
      .status(StatusCodes.OK)
      .json({ newUser, tokens: { accessToken: myToken } });
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.CONFLICT).send(ReasonPhrases.CONFLICT);
  }
});

export { AuthRouter };
