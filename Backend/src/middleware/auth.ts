import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import prisma from "../config/db.js";
import {
  sendForbidden,
  sendRateLimitExceeded,
  sendServerError,
  sendUnauthorized,
} from "../utils/response.js";
import { rateLimit } from "express-rate-limit";

type DecodedToken = JwtPayload & {
  userId: string;
  email: string;
};

function getJwtSecret() {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error("JWT_SECRET is not configured");
  }
  return jwtSecret;
}

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authorizationHeader = req.header("Authorization");

    if (!authorizationHeader) {
      const err: any = new Error("Access denied. No token provided.");
      err.status = 401;
      return next(err);
    }

    const headerMatch = authorizationHeader.trim().match(/^Bearer\s+([^\s]+)$/);

    if (!headerMatch) {
      const err: any = new Error(
        "Malformed authorization header. Expected: Bearer <token>.",
      );
      err.status = 401;
      return next(err);
    }

    const token = headerMatch[1];

    const decoded = jwt.verify(token, getJwtSecret()) as DecodedToken;

    const user = await prisma.user.findFirst({
      where: {
        id: decoded.userId,
        deletedAt: null,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isVerified: true,
        deletedAt: true,
      },
    });


    if (!user) {
      const err: any = new Error(
        "Account has been deleted or is no longer available.",
      );
      err.status = 401;
      return next(err);
    }

    user.name = user.name?.trim();

    req.user = user;
    req.token = token;

    return next();
  } catch (error) {
    const cause = error as Error;
    if (cause.name === "JsonWebTokenError") {
      const err: any = new Error("Invalid token.");
      err.status = 401;
      return next(err);
    }
    if (cause.name === "TokenExpiredError") {
      const err: any = new Error("Token expired.");
      err.status = 401;
      return next(err);
    }
    return next(error);
  }
};

export const authAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      const err: any = new Error("Authentication required.");
      err.status = 401;
      return next(err);
    }

    if (req.user.role !== "Admin") {
      const err: any = new Error("Access denied. Admin privileges required.");
      err.status = 403;
      return next(err);
    }

    return next();
  } catch (error) {
    return next(error);
  }
};

export const authStoreOwner = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      const err: any = new Error("Authentication required.");
      err.status = 401;
      return next(err);
    }

    if (req.user.role !== "StoreOwner" && req.user.role !== "Admin") {
      const err: any = new Error(
        "Access denied. Store owner privileges required.",
      );
      err.status = 403;
      return next(err);
    }

    return next();
  } catch (error) {
    return next(error);
  }
};

export const authLimiter = rateLimit({
  windowMs: 30 * 60 * 1000, // 30 minutes
  max: 5, // Strict: Only 5 attempts allowed per IP
  handler: (req, res) => {
    sendRateLimitExceeded(
      res,
      "Too many attempts, please try again after 30 minutes",
    );
  },
});

export const refreshLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30,
  handler: (req, res) => {
    sendRateLimitExceeded(
      res,
      "Too many refresh attempts, please try again after 15 minutes",
    );
  },
});
