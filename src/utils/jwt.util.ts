import { User } from "@prisma/client";
import jwt, { JwtPayload } from "jsonwebtoken";

export const createAccessToken = (user: User): string =>
  jwt.sign({ id: user.id }, process.env.ACCESS_TOKEN_SECRET as string, {
    expiresIn: "1d",
  });

export const verifyAccessToken = (token: string): string | JwtPayload =>
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string);
