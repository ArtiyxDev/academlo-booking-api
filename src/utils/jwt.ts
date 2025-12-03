import jwt from "jsonwebtoken";
import type ms from "ms";
import { env } from "../config/env";

interface TokenPayload {
  userId: number;
  email: string;
  role: string;
}

export const generateToken = (payload: TokenPayload) => {
  const token = jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as ms.StringValue,
  });
  return token;
};

export const verifyToken = (token: string) => {
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as TokenPayload;
    return decoded;
  } catch (error) {
    return null;
  }
};
