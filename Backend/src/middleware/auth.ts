import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import prisma from "../config/db.js";
import { sendForbidden, sendServerError, sendUnauthorized } from "../utils/response.js";

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
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return sendUnauthorized(res, "Access denied. No token provided.");
    }

    const decoded = jwt.verify(token, getJwtSecret()) as DecodedToken;

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
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
      return sendUnauthorized(res, "Invalid token. User not found.");
    }

    if (user.deletedAt) {
      return sendUnauthorized(res, "Account has been deleted.");
    }

    user.name = user.name?.trimEnd();

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
    return sendServerError(res, "Internal server error during authentication.", error);
  }
};

export const authAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return sendUnauthorized(res, "Authentication required.");
    }

    if (req.user.role !== "Admin") {
      return sendForbidden(res, "Access denied. Admin privileges required.");
    }

    next();
  } catch (error) {
    return sendServerError(res, "Internal server error during authorization.", error);
  }
};

export const authStoreOwner = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return sendUnauthorized(res, "Authentication required.");
    }

    if (req.user.role !== "StoreOwner" && req.user.role !== "Admin") {
      return sendForbidden(res, "Access denied. Store owner privileges required.");
    }

    next();
  } catch (error) {
    return sendServerError(res, "Internal server error during authorization.", error);
  }
};