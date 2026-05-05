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
      return sendUnauthorized(res, "Access denied. No token provided.");
    }

    const headerMatch = authorizationHeader.trim().match(/^Bearer\s+([^\s]+)$/);
    if (!headerMatch) {
      return sendUnauthorized(
        res,
        "Malformed authorization header. Expected: Bearer <token>.",
      );
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
      return sendUnauthorized(
        res,
        "Account has been deleted or is no longer available.",
      );
    }

    user.name = user.name?.trim();

    req.user = user;
    req.token = token;

    next();
  } catch (error) {
    const cause = error as Error;
    if (cause.name === "JsonWebTokenError") {
      return sendUnauthorized(res, "Invalid token.");
    }
    if (cause.name === "TokenExpiredError") {
      return sendUnauthorized(res, "Token expired.");
    }
    return sendServerError(
      res,
      "Internal server error during authentication.",
      error,
    );
  }
};

export const authAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      return sendUnauthorized(res, "Authentication required.");
    }

    if (req.user.role !== "Admin") {
      return sendForbidden(res, "Access denied. Admin privileges required.");
    }

    next();
  } catch (error) {
    return sendServerError(
      res,
      "Internal server error during authorization.",
      error,
    );
  }
};

export const authStoreOwner = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      return sendUnauthorized(res, "Authentication required.");
    }

    if (req.user.role !== "StoreOwner" && req.user.role !== "Admin") {
      return sendForbidden(
        res,
        "Access denied. Store owner privileges required.",
      );
    }

    next();
  } catch (error) {
    return sendServerError(
      res,
      "Internal server error during authorization.",
      error,
    );
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
