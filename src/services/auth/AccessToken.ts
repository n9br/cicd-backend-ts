import jwt, { JwtPayload } from "jsonwebtoken";

const { JWT_SECRET } = process.env;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

interface AccessTokenPayload extends JwtPayload {
  userId: number;
}

function createAccessToken(userId: number): string {
  const accessToken = jwt.sign({ userId }, JWT_SECRET, { expiresIn: "24h" });
  return accessToken;
}

function decodeAccessToken(accessToken: string): AccessTokenPayload {
  const decodedToken = jwt.verify(
    accessToken,
    JWT_SECRET
  ) as AccessTokenPayload;
  return decodedToken;
}

export { createAccessToken, decodeAccessToken };
