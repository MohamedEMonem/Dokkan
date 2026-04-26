import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import prisma from "../../config/db.js";
import { hashPassword, verifyPassword } from "../../utils/password.js";
import {
  sendError,
  sendServerError,
  sendSuccess,
} from "../../utils/response.js";
import { UserRole } from "@prisma/client";

function getJwtSecret() {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error("JWT_SECRET is not configured");
  }
  return jwtSecret;
}

function buildToken(payload: { userId: string; email: string }) {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: "7d" });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function getPayload(req: Request): Record<string, unknown> | null {
  if (!isRecord(req.body)) return null;

  const data = req.body.data;
  if (data !== undefined) {
    return isRecord(data) ? data : null;
  }

  return req.body;
}

function normalizeEmail(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const normalized = value.trim().toLowerCase();
  return normalized.length > 0 ? normalized : null;
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

// --- Validation helpers ---

/**
 * Validates email format using RFC 5322-inspired regex.
 * Catches obvious malformed addresses (missing @, no TLD, etc.).
 */
function isValidEmail(email: string): boolean {
  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  return EMAIL_REGEX.test(email);
}

/**
 * Validates password strength:
 *  - At least 8 characters
 *  - At least one uppercase letter
 *  - At least one lowercase letter
 *  - At least one digit
 *  - At least one special character (!@#$%^&*()_+-=[]{}|;':",.<>?/`~\)
 */
function validatePasswordStrength(password: string): string | null {
  if (password.length < 8) {
    return "Password must be at least 8 characters long";
  }
  if (!/[A-Z]/.test(password)) {
    return "Password must contain at least one uppercase letter";
  }
  if (!/[a-z]/.test(password)) {
    return "Password must contain at least one lowercase letter";
  }
  if (!/[0-9]/.test(password)) {
    return "Password must contain at least one number";
  }
  if (!/[!@#$%^&*()\-_=+\[\]{}|;':",.<>?/`~\\]/.test(password)) {
    return "Password must contain at least one special character";
  }
  return null;
}

/**
 * Validates a phone/contact number.
 * Accepts optional leading +, then digits, spaces, dashes, and parentheses.
 * Must contain between 7 and 15 digits total.
 */
function isValidContactNumber(value: string): boolean {
  const PHONE_REGEX = /^\+?[\d\s\-().]{7,20}$/;
  const digitsOnly = value.replace(/\D/g, "");
  return (
    PHONE_REGEX.test(value) && digitsOnly.length >= 7 && digitsOnly.length <= 15
  );
}

/**
 * Validates that a URL starts with http:// or https:// and has a valid host.
 */
function isValidUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

// --- Selects ---

const USER_PUBLIC_SELECT = {
  id: true,
  email: true,
  name: true,
  role: true,
  contactNumber: true,
  profilePhotoUrl: true,
  isVerified: true,
  createdAt: true,
} as const;

const AUTH_USER_SELECT = {
  id: true,
  email: true,
  password: true,
  name: true,
  role: true,
  contactNumber: true,
  profilePhotoUrl: true,
  isVerified: true,
  createdAt: true,
  deletedAt: true,
} as const;

function toPublicUser<
  T extends { name?: string | null; password?: string | null },
>(user: T) {
  const { password, ...safeUser } = user;

  return {
    ...safeUser,
    name: safeUser.name?.trim() || undefined,
  };
}

// --- Handlers ---

export const register = async (req: Request, res: Response) => {
  try {
    const requestData = getPayload(req);
    if (!requestData) {
      return sendError(res, "Invalid request body", 400);
    }

    const normalizedEmail = normalizeEmail(requestData.email);
    const password = requestData.password;
    const name = requestData.name;

    if (
      !normalizedEmail ||
      !isNonEmptyString(password) ||
      !isNonEmptyString(name)
    ) {
      return sendError(res, "Please provide email, password, and name", 400);
    }

    // Email format
    if (!isValidEmail(normalizedEmail)) {
      return sendError(res, "Please provide a valid email address", 400);
    }

    // Password strength
    const passwordError = validatePasswordStrength(password);
    if (passwordError) {
      return sendError(res, passwordError, 400);
    }

    const normalizedName = name.trim();

    if (normalizedName.length > 50) {
      return sendError(res, "Name must be at most 50 characters", 400);
    }

    // Role validation (optional, defaults to Customer)
    if (
      requestData.role &&
      requestData.role !== "Customer" &&
      requestData.role !== "StoreOwner"
    ) {
      return sendError(res, "Cannot assign invalid role", 403);
    }

    const userRole =
      requestData.role === "StoreOwner"
        ? UserRole.StoreOwner
        : UserRole.Customer;

    const existingUser = await prisma.user.findFirst({
      where: {
        email: {
          equals: normalizedEmail,
          mode: "insensitive",
        },
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        contactNumber: true,
        profilePhotoUrl: true,
        googleOauthId: true,
        isVerified: true,
        deletedAt: true,
      },
    });

    if (existingUser) {
      if (existingUser.deletedAt) {
        const hashedPassword = await hashPassword(password);

        const restoredUser = await prisma.user.update({
          where: { id: existingUser.id },
          data: {
            email: normalizedEmail,
            password: hashedPassword,
            name: normalizedName,
            role: userRole,
            deletedAt: null,
            isVerified: false,
            googleOauthId: null,
          },
          select: USER_PUBLIC_SELECT,
        });

        const token = buildToken({
          userId: restoredUser.id,
          email: restoredUser.email,
        });

        return sendSuccess(
          res,
          { user: toPublicUser(restoredUser), token },
          "Account restored and registered successfully",
          200,
        );
      }

      return sendError(res, "User already exists", 409);
    }

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        password: hashedPassword,
        name: normalizedName,
        role: userRole,
      },
      select: USER_PUBLIC_SELECT,
    });

    const token = buildToken({ userId: user.id, email: user.email });

    return sendSuccess(
      res,
      { user: toPublicUser(user), token },
      "User created successfully",
      201,
    );
  } catch (error) {
    return sendServerError(res, "Internal server error", error);
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const requestData = getPayload(req);
    if (!requestData) {
      return sendError(res, "Invalid request body", 400);
    }

    const normalizedEmail = normalizeEmail(requestData.email);
    const password = requestData.password;

    if (
      !normalizedEmail ||
      typeof password !== "string" ||
      password.length === 0
    ) {
      return sendError(res, "Please provide email and password", 400);
    }

    // Email format — avoids a pointless DB round-trip for obviously bad input
    if (!isValidEmail(normalizedEmail)) {
      return sendError(res, "Invalid email or password", 401);
    }

    const user = await prisma.user.findFirst({
      where: {
        email: {
          equals: normalizedEmail,
          mode: "insensitive",
        },
      },
      select: AUTH_USER_SELECT,
    });

    if (!user) {
      return sendError(res, "Invalid email or password", 401);
    }

    if (user.deletedAt) {
      return sendError(res, "This account has been deleted.", 401);
    }

    const isPasswordValid = await verifyPassword(password, user.password);
    if (!isPasswordValid) {
      return sendError(res, "Invalid email or password", 401);
    }

    const token = buildToken({ userId: user.id, email: user.email });

    return sendSuccess(
      res,
      { user: toPublicUser(user), token },
      "Logged in successfully",
    );
  } catch (error) {
    return sendServerError(res, "Internal server error", error);
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findFirst({
      where: {
        id: req.user!.id,
        deletedAt: null,
      },
      select: USER_PUBLIC_SELECT,
    });

    if (!user) {
      return sendError(res, "User not found", 404);
    }

    return sendSuccess(
      res,
      { user: toPublicUser(user) },
      "Profile retrieved successfully",
    );
  } catch (error) {
    return sendServerError(res, "Internal server error", error);
  }
};

export const patchProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const payload = getPayload(req);

    if (!payload) {
      return sendError(res, "Invalid request body", 400);
    }

    const allowedFields = ["name", "contactNumber", "profilePhotoUrl"];
    const payloadKeys = Object.keys(payload);

    if (payloadKeys.length === 0) {
      return sendError(res, "No data provided for update", 400);
    }

    const invalidFields = payloadKeys.filter(
      (key) => !allowedFields.includes(key),
    );
    if (invalidFields.length > 0) {
      return sendError(res, `Invalid fields: ${invalidFields.join(", ")}`, 400);
    }

    const data: Record<string, unknown> = {};

    if (Object.prototype.hasOwnProperty.call(payload, "name")) {
      const value = payload.name;
      if (value === null) {
        return sendError(res, "name cannot be null", 400);
      }
      if (typeof value !== "string" || value.trim().length === 0) {
        return sendError(res, "name must be a non-empty string", 400);
      }
      if (value.trim().length > 50) {
        return sendError(res, "name must be at most 50 characters", 400);
      }
      data.name = value.trim();
    }

    if (Object.prototype.hasOwnProperty.call(payload, "contactNumber")) {
      const value = payload.contactNumber;
      if (value === null) {
        data.contactNumber = null;
      } else if (typeof value === "string") {
        const trimmed = value.trim();
        if (trimmed.length === 0) {
          data.contactNumber = null;
        } else {
          if (!isValidContactNumber(trimmed)) {
            return sendError(
              res,
              "contactNumber must be a valid phone number (7–15 digits, optionally formatted with +, spaces, dashes, or parentheses)",
              400,
            );
          }
          if (trimmed.length > 20) {
            return sendError(
              res,
              "contactNumber must be at most 20 characters",
              400,
            );
          }
          data.contactNumber = trimmed;
        }
      } else {
        return sendError(res, "contactNumber must be a string or null", 400);
      }
    }

    if (Object.prototype.hasOwnProperty.call(payload, "profilePhotoUrl")) {
      const value = payload.profilePhotoUrl;
      if (value === null) {
        data.profilePhotoUrl = null;
      } else if (typeof value === "string") {
        const trimmed = value.trim();
        if (trimmed.length === 0) {
          data.profilePhotoUrl = null;
        } else {
          if (!isValidUrl(trimmed)) {
            return sendError(
              res,
              "profilePhotoUrl must be a valid URL starting with http:// or https://",
              400,
            );
          }
          if (trimmed.length > 255) {
            return sendError(
              res,
              "profilePhotoUrl must be at most 255 characters",
              400,
            );
          }
          data.profilePhotoUrl = trimmed;
        }
      } else {
        return sendError(res, "profilePhotoUrl must be a string or null", 400);
      }
    }

    if (Object.keys(data).length === 0) {
      return sendError(res, "No valid fields provided for update", 400);
    }

    const result = await prisma.user.updateMany({
      where: {
        id: userId,
        deletedAt: null,
      },
      data,
    });

    if (result.count === 0) {
      return sendError(res, "Account not found or already deleted", 404);
    }

    const updatedUser = await prisma.user.findFirst({
      where: {
        id: userId,
        deletedAt: null,
      },
      select: USER_PUBLIC_SELECT,
    });

    if (!updatedUser) {
      return sendError(res, "Account not found or already deleted", 404);
    }

    return sendSuccess(
      res,
      { user: toPublicUser(updatedUser) },
      "Profile updated successfully",
    );
  } catch (error) {
    return sendServerError(res, "Internal server error", error);
  }
};

export const deleteAccount = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;

    const result = await prisma.user.updateMany({
      where: {
        id: userId,
        deletedAt: null,
      },
      data: { deletedAt: new Date() },
    });

    if (result.count === 0) {
      return sendError(res, "Account not found or already deleted", 404);
    }

    return sendSuccess(res, null, "Account deleted successfully");
  } catch (error) {
    return sendServerError(res, "Internal server error", error);
  }
};
