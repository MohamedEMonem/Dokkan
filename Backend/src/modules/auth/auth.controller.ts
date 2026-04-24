import type { Request, Response } from "express";
<<<<<<< HEAD
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../../config/db.js";
=======
import jwt from "jsonwebtoken";
import prisma from "../../config/db.js";
import { hashPassword, verifyPassword } from "../../utils/password.js";
>>>>>>> origin/dev
import { sendError, sendServerError, sendSuccess } from "../../utils/response.js";

function getJwtSecret() {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error("JWT_SECRET is not configured");
  }
  return jwtSecret;
}

<<<<<<< HEAD
=======
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

>>>>>>> origin/dev
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

<<<<<<< HEAD
function trimUser<T extends { name?: string | null }>(user: T) {
  if (!user) return user;
  return { ...user, name: user.name?.trimEnd() };
=======
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

function toPublicUser<T extends { name?: string | null }>(user: T) {
  return {
    ...user,
    name: user.name?.trim(),
  };
>>>>>>> origin/dev
}

export const register = async (req: Request, res: Response) => {
  try {
<<<<<<< HEAD
    const requestData = req.body?.data ?? req.body ?? {};
    const { email, password, name } = requestData;
    const normalizedName = typeof name === "string" ? name.trim() : "";

    if (!email || !password || !normalizedName) {
      return sendError(res, "Please provide email, password, and name", 400);
    }

=======
    const requestData = getPayload(req);
    if (!requestData) {
      return sendError(res, "Invalid request body", 400);
    }

    const normalizedEmail = normalizeEmail(requestData.email);
    const password = requestData.password;
    const name = requestData.name;

    if (!normalizedEmail || !isNonEmptyString(password) || !isNonEmptyString(name)) {
      return sendError(res, "Please provide email, password, and name", 400);
    }

    const normalizedName = name.trim();

>>>>>>> origin/dev
    if (normalizedName.length > 50) {
      return sendError(res, "Name must be at most 50 characters", 400);
    }

<<<<<<< HEAD
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return sendError(res, "User already exists", 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
=======
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
            deletedAt: null,
            isVerified: false,
            googleOauthId: null,
          },
          select: USER_PUBLIC_SELECT,
        });

        const token = buildToken({ userId: restoredUser.id, email: restoredUser.email });

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
>>>>>>> origin/dev
        password: hashedPassword,
        name: normalizedName,
      },
      select: USER_PUBLIC_SELECT,
    });

<<<<<<< HEAD
    const token = jwt.sign({ userId: user.id, email: user.email }, getJwtSecret(), {
      expiresIn: "7d",
    });

    return sendSuccess(res, { user: trimUser(user), token }, "User created successfully", 201);
=======
    const token = buildToken({ userId: user.id, email: user.email });

    return sendSuccess(res, { user: toPublicUser(user), token }, "User created successfully", 201);
>>>>>>> origin/dev
  } catch (error) {
    return sendServerError(res, "Internal server error", error);
  }
};

export const login = async (req: Request, res: Response) => {
  try {
<<<<<<< HEAD
    const { email, password } = req.body;
    if (!email || !password) {
      return sendError(res, "Please provide email and password", 400);
    }

    const user = await prisma.user.findUnique({ where: { email } });
=======
    const requestData = getPayload(req);
    if (!requestData) {
      return sendError(res, "Invalid request body", 400);
    }

    const normalizedEmail = normalizeEmail(requestData.email);
    const password = requestData.password;

    if (!normalizedEmail || typeof password !== "string" || password.length === 0) {
      return sendError(res, "Please provide email and password", 400);
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
>>>>>>> origin/dev
    if (!user) {
      return sendError(res, "Invalid email or password", 401);
    }

    if (user.deletedAt) {
<<<<<<< HEAD
      return sendError(res, "Account has been deleted", 401);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
=======
      return sendError(res, "This account has been deleted.", 401);
    }

    const isPasswordValid = await verifyPassword(password, user.password);
>>>>>>> origin/dev
    if (!isPasswordValid) {
      return sendError(res, "Invalid email or password", 401);
    }

<<<<<<< HEAD
    const token = jwt.sign({ userId: user.id, email: user.email }, getJwtSecret(), {
      expiresIn: "7d",
    });
=======
    const token = buildToken({ userId: user.id, email: user.email });
>>>>>>> origin/dev

    return sendSuccess(
      res,
      {
<<<<<<< HEAD
        user: {
          id: user.id,
          email: user.email,
          name: user.name?.trimEnd(),
          role: user.role,
          contactNumber: user.contactNumber,
          profilePhotoUrl: user.profilePhotoUrl,
          isVerified: user.isVerified,
          createdAt: user.createdAt,
        },
=======
        user: toPublicUser(user),
>>>>>>> origin/dev
        token,
      },
      "Logged in successfully",
    );
  } catch (error) {
    return sendServerError(res, "Internal server error", error);
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
<<<<<<< HEAD
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
=======
    const user = await prisma.user.findFirst({
      where: {
        id: req.user!.id,
        deletedAt: null,
      },
>>>>>>> origin/dev
      select: USER_PUBLIC_SELECT,
    });

    if (!user) {
      return sendError(res, "User not found", 404);
    }

<<<<<<< HEAD
    return sendSuccess(res, { user: trimUser(user) }, "Profile retrieved successfully");
=======
    return sendSuccess(res, { user: toPublicUser(user) }, "Profile retrieved successfully");
>>>>>>> origin/dev
  } catch (error) {
    return sendServerError(res, "Internal server error", error);
  }
};

export const patchProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
<<<<<<< HEAD

    const allowedFields = ["name", "contactNumber", "profilePhotoUrl"];
    const payloadKeys = Object.keys(req.body || {});
=======
    const payload = getPayload(req);

    if (!payload) {
      return sendError(res, "Invalid request body", 400);
    }

    const allowedFields = ["name", "contactNumber", "profilePhotoUrl"];
    const payloadKeys = Object.keys(payload);
>>>>>>> origin/dev

    if (payloadKeys.length === 0) {
      return sendError(res, "No data provided for update", 400);
    }

    const invalidFields = payloadKeys.filter((key) => !allowedFields.includes(key));
    if (invalidFields.length > 0) {
      return sendError(res, `Invalid fields: ${invalidFields.join(", ")}`, 400);
    }

    const data: Record<string, unknown> = {};

<<<<<<< HEAD
    if (Object.prototype.hasOwnProperty.call(req.body, "name")) {
      const value = req.body.name;
=======
    if (Object.prototype.hasOwnProperty.call(payload, "name")) {
      const value = payload.name;
>>>>>>> origin/dev
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

<<<<<<< HEAD
    if (Object.prototype.hasOwnProperty.call(req.body, "contactNumber")) {
      const value = req.body.contactNumber;
=======
    if (Object.prototype.hasOwnProperty.call(payload, "contactNumber")) {
      const value = payload.contactNumber;
>>>>>>> origin/dev
      if (value === null) {
        data.contactNumber = null;
      } else if (typeof value === "string") {
        const trimmed = value.trim();
        if (trimmed.length > 20) {
          return sendError(res, "contactNumber must be at most 20 characters", 400);
        }
        data.contactNumber = trimmed.length ? trimmed : null;
      } else {
        return sendError(res, "contactNumber must be a string or null", 400);
      }
    }

<<<<<<< HEAD
    if (Object.prototype.hasOwnProperty.call(req.body, "profilePhotoUrl")) {
      const value = req.body.profilePhotoUrl;
=======
    if (Object.prototype.hasOwnProperty.call(payload, "profilePhotoUrl")) {
      const value = payload.profilePhotoUrl;
>>>>>>> origin/dev
      if (value === null) {
        data.profilePhotoUrl = null;
      } else if (typeof value === "string") {
        const trimmed = value.trim();
        if (trimmed.length > 255) {
          return sendError(res, "profilePhotoUrl must be at most 255 characters", 400);
        }
        data.profilePhotoUrl = trimmed.length ? trimmed : null;
      } else {
        return sendError(res, "profilePhotoUrl must be a string or null", 400);
      }
    }

    if (Object.keys(data).length === 0) {
      return sendError(res, "No valid fields provided for update", 400);
    }

<<<<<<< HEAD
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data,
      select: USER_PUBLIC_SELECT,
    });

    return sendSuccess(res, { user: trimUser(updatedUser) }, "Profile updated successfully");
=======
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

    return sendSuccess(res, { user: toPublicUser(updatedUser) }, "Profile updated successfully");
>>>>>>> origin/dev
  } catch (error) {
    return sendServerError(res, "Internal server error", error);
  }
};

export const deleteAccount = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;

<<<<<<< HEAD
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.deletedAt) {
      return sendError(res, "Account not found or already deleted", 404);
    }

    await prisma.user.update({
      where: { id: userId },
      data: { deletedAt: new Date() },
    });

=======
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

>>>>>>> origin/dev
    return sendSuccess(res, null, "Account deleted successfully");
  } catch (error) {
    return sendServerError(res, "Internal server error", error);
  }
};