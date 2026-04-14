import jwt from "jsonwebtoken";
import prisma from "../config/db.js";
import { sendUnauthorized, sendForbidden, sendServerError } from "../utils/response.js";

function getJwtSecret() {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
        throw new Error("JWT_SECRET is not configured");
    }
    return jwtSecret;
}

/**
 * Authentication middleware
 * Verifies JWT token and attaches user to request
 */
const auth = async (req, res, next) => {
    try {
        // Get token from header
        const token = req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            return sendUnauthorized(res, "Access denied. No token provided.");
        }

        // Verify token
        const decoded = jwt.verify(token, getJwtSecret());

        // Get user from database
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                isVerified: true,
                deletedAt: true
            }
        });

        if (!user) {
            return sendUnauthorized(res, "Invalid token. User not found.");
        }

        // Check if user account is deleted
        if (user.deletedAt) {
            return sendUnauthorized(res, "Account has been deleted.");
        }

        user.name = user.name?.trimEnd();

        // Attach user to request
        req.user = user;
        req.token = token;

        next();
    } catch (error) {
        if (error.name === "JsonWebTokenError") {
            return sendUnauthorized(res, "Invalid token.");
        }
        if (error.name === "TokenExpiredError") {
            return sendUnauthorized(res, "Token expired.");
        }
        return sendServerError(res, "Internal server error during authentication.", error);
    }
};

/**
 * Admin authorization middleware
 * Checks if authenticated user has Admin role
 */
const authAdmin = async (req, res, next) => {
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

/**
 * Store owner authorization middleware
 * Checks if authenticated user has StoreOwner or Admin role
 */
const authStoreOwner = async (req, res, next) => {
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

export {
    auth,
    authAdmin,
    authStoreOwner
};
