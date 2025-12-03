import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { UnauthorizedError } from "./errorHandler";

/**
 * Interface for JWT payload
 */
interface JwtPayload {
  userId: number;
  email: string;
  role: string;
}

/**
 * Extend Express Request to include user property
 */
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

/**
 * Middleware to authenticate JWT token
 */
export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new UnauthorizedError("No token provided");
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      throw new UnauthorizedError("No token provided");
    }

    // Verify token
    const decoded = jwt.verify(token, env.JWT_SECRET) as unknown as JwtPayload;

    // Attach user info to request
    req.user = decoded;

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(new UnauthorizedError("Invalid token"));
    } else if (error instanceof jwt.TokenExpiredError) {
      next(new UnauthorizedError("Token expired"));
    } else {
      next(error);
    }
  }
};

export const authorizeAdmin = (req: Request, res: Response, next: NextFunction): void => {
  try {
    if (req.user?.role !== "ADMIN") {
      throw new UnauthorizedError("Admin privileges required: ");
    }
    next();
  } catch (error) {
    next(error);
  }
};
