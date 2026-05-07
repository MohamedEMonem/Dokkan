import type { Request, Response } from "express";
import jwt, { type JwtPayload, type SignOptions } from "jsonwebtoken";
import prisma from "../../config/db.js";
import { hashPassword, verifyPassword } from "../../utils/password.js";
import {
  sendError,
  sendServerError,
  sendSuccess,
  sendUnauthorized,
} from "../../utils/response.js";
import { UserRole } from "@prisma/client";
import { emailService } from "../../services/email.service.js";
import redis from "../../config/redis.js";
import { randomInt, randomUUID } from "crypto";

/**
 * Generates a cryptographically secure numeric OTP.
 * @param length The number of digits (defaults to 6 for Dokkan auth).
 * @returns A string representation of the OTP.
 */
export const GenerateOTP = (length: number = 6): string => {
  // Calculate the range based on length (e.g., 6 digits = 100,000 to 999,999)
  const min = Math.pow(10, length - 1);
  const max = Math.pow(10, length);

  // randomInt generates a CSPRNG value that is not predictable
  return randomInt(min, max).toString();
};

function getJwtSecret() {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error("JWT_SECRET is not configured");
  }
  return jwtSecret;
}

function buildToken(payload: { userId: string; email: string }) {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: "15m" });
}

type RefreshTokenPayload = JwtPayload & {
  userId: string;
  email: string;
  sessionId: string;
};

function getRefreshTokenSecret() {
  const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
  if (!refreshTokenSecret) {
    throw new Error("REFRESH_TOKEN_SECRET is not configured");
  }
  return refreshTokenSecret;
}

function getRefreshTokenExpiry() {
  return process.env.REFRESH_TOKEN_EXPIRES_IN || "7d";
}

function getRefreshCookieName() {
  return process.env.REFRESH_COOKIE_NAME || "refreshToken";
}

function getRefreshKeyPrefix() {
  return process.env.REFRESH_TOKEN_PREFIX || "refresh";
}

function parseDurationToSeconds(value: string): number {
  const match = value.trim().match(/^(\d+)([smhd])$/i);
  if (!match) return 7 * 24 * 60 * 60;

  const amount = Number(match[1]);
  const unit = match[2].toLowerCase();
  const multiplierMap: Record<string, number> = {
    s: 1,
    m: 60,
    h: 60 * 60,
    d: 24 * 60 * 60,
  };

  return amount * (multiplierMap[unit] || 1);
}

function getRefreshTtlSeconds() {
  const ttlSeconds = parseDurationToSeconds(getRefreshTokenExpiry());
  return ttlSeconds > 0 ? ttlSeconds : 7 * 24 * 60 * 60;
}

function getRefreshCookieOptions() {
  const sameSiteRaw =
    process.env.REFRESH_COOKIE_SAMESITE?.toLowerCase() || "lax";
  const sameSite =
    sameSiteRaw === "strict" || sameSiteRaw === "none" ? sameSiteRaw : "lax";

  const secureFromEnv = process.env.REFRESH_COOKIE_SECURE;
  const secure =
    secureFromEnv !== undefined
      ? secureFromEnv === "true"
      : process.env.NODE_ENV === "production";

  const baseOptions = {
    httpOnly: true,
    secure,
    sameSite,
    path: process.env.REFRESH_COOKIE_PATH || "/api/auth",
    maxAge: getRefreshTtlSeconds() * 1000,
  } as const;

  if (process.env.REFRESH_COOKIE_DOMAIN) {
    return {
      ...baseOptions,
      domain: process.env.REFRESH_COOKIE_DOMAIN,
    };
  }

  return baseOptions;
}

function parseCookies(req: Request): Record<string, string> {
  const cookieHeader = req.headers.cookie;
  if (!cookieHeader) return {};

  const parsedCookies: Record<string, string> = {};
  for (const rawPart of cookieHeader.split(";")) {
    const part = rawPart.trim();
    if (!part) continue;

    const separatorIndex = part.indexOf("=");
    if (separatorIndex === -1) continue;

    const key = part.slice(0, separatorIndex).trim();
    const value = part.slice(separatorIndex + 1).trim();
    if (!key) continue;

    parsedCookies[key] = decodeURIComponent(value);
  }

  return parsedCookies;
}

function getRefreshTokenFromRequest(req: Request): string | null {
  const cookies = parseCookies(req);
  const token = cookies[getRefreshCookieName()];
  return token && token.length > 0 ? token : null;
}

function getRefreshSessionKey(userId: string, sessionId: string) {
  return `${getRefreshKeyPrefix()}:${userId}:${sessionId}`;
}

function buildRefreshToken(payload: {
  userId: string;
  email: string;
  sessionId: string;
}) {
  const expiresIn = getRefreshTokenExpiry() as SignOptions["expiresIn"];
  return jwt.sign(payload, getRefreshTokenSecret(), {
    expiresIn,
  });
}

async function saveRefreshSession(
  userId: string,
  sessionId: string,
  refreshToken: string,
) {
  await redis.setex(
    getRefreshSessionKey(userId, sessionId),
    getRefreshTtlSeconds(),
    refreshToken,
  );
}

async function isRefreshSessionValid(
  userId: string,
  sessionId: string,
  refreshToken: string,
) {
  const storedToken = await redis.get(getRefreshSessionKey(userId, sessionId));
  return storedToken === refreshToken;
}

async function rotateRefreshSession(
  oldUserId: string,
  oldSessionId: string,
  newUserId: string,
  newSessionId: string,
  newRefreshToken: string,
) {
  const multi = redis.multi();
  multi.del(getRefreshSessionKey(oldUserId, oldSessionId));
  multi.setex(
    getRefreshSessionKey(newUserId, newSessionId),
    getRefreshTtlSeconds(),
    newRefreshToken,
  );
  await multi.exec();
}

async function revokeRefreshSession(userId: string, sessionId: string) {
  await redis.del(getRefreshSessionKey(userId, sessionId));
}

async function revokeAllRefreshSessionsForUser(userId: string) {
  const pattern = `${getRefreshKeyPrefix()}:${userId}:*`;
  const keys = await redis.keys(pattern);
  if (keys.length > 0) {
    await redis.del(...keys);
  }
}

function setRefreshCookie(res: Response, refreshToken: string) {
  res.cookie(getRefreshCookieName(), refreshToken, getRefreshCookieOptions());
}

function clearRefreshCookie(res: Response) {
  const cookieOptions = getRefreshCookieOptions();
  res.clearCookie(getRefreshCookieName(), {
    httpOnly: cookieOptions.httpOnly,
    secure: cookieOptions.secure,
    sameSite: cookieOptions.sameSite,
    path: cookieOptions.path,
    domain: "domain" in cookieOptions ? cookieOptions.domain : undefined,
  });
}

async function issueRefreshToken(userId: string, email: string) {
  const sessionId = randomUUID();
  const refreshToken = buildRefreshToken({ userId, email, sessionId });
  await saveRefreshSession(userId, sessionId, refreshToken);
  return { refreshToken };
}

function verifyRefreshToken(refreshToken: string): RefreshTokenPayload {
  return jwt.verify(refreshToken, getRefreshTokenSecret()) as RefreshTokenPayload;
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
    const otp = GenerateOTP();
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
        const { refreshToken } = await issueRefreshToken(
          restoredUser.id,
          restoredUser.email,
        );
        setRefreshCookie(res, refreshToken);

        await redis.setex(`otp:${restoredUser.email}`, 900, otp);
        // Send the email
        await emailService.sendMail({
          to: restoredUser.email,
          subject: "Verify your Dokkan Account",
          template: "otp-verification",
          data: { name: restoredUser.name, otp },
        });

        return sendSuccess(
          res,
          { user: toPublicUser(restoredUser), token },
          "Account restored and registered successfully, Please check your email for the verification code.",
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
    const { refreshToken } = await issueRefreshToken(user.id, user.email);
    setRefreshCookie(res, refreshToken);

    await redis.setex(`otp:${user.email}`, 900, otp);

    // Send the email
    await emailService.sendMail({
      to: user.email,
      subject: "Verify your Dokkan Account",
      template: "otp-verification",
      data: { name: user.name, otp },
    });

    return sendSuccess(
      res,
      { user: toPublicUser(user), token },
      "User created successfully, Please check your email for the verification code.",
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
    const { refreshToken } = await issueRefreshToken(user.id, user.email);
    setRefreshCookie(res, refreshToken);

    return sendSuccess(
      res,
      { user: toPublicUser(user), token },
      "Logged in successfully",
    );
  } catch (error) {
    return sendServerError(res, "Internal server error", error);
  }
};

export const refresh = async (req: Request, res: Response) => {
  try {
    const refreshToken = getRefreshTokenFromRequest(req);
    if (!refreshToken) {
      clearRefreshCookie(res);
      return sendUnauthorized(res, "Refresh token is missing.");
    }

    const decoded = verifyRefreshToken(refreshToken);
    const userId = decoded.userId;
    const sessionId = decoded.sessionId;

    if (!userId || !decoded.email || !sessionId) {
      clearRefreshCookie(res);
      return sendUnauthorized(res, "Invalid refresh token payload.");
    }

    const isSessionValid = await isRefreshSessionValid(
      userId,
      sessionId,
      refreshToken,
    );
    if (!isSessionValid) {
      clearRefreshCookie(res);
      return sendUnauthorized(res, "Invalid or revoked refresh token.");
    }

    const user = await prisma.user.findFirst({
      where: {
        id: userId,
        deletedAt: null,
      },
      select: USER_PUBLIC_SELECT,
    });

    if (!user) {
      await revokeRefreshSession(userId, sessionId);
      clearRefreshCookie(res);
      return sendUnauthorized(res, "Account has been deleted or disabled.");
    }

    const newSessionId = randomUUID();
    const newRefreshToken = buildRefreshToken({
      userId,
      email: user.email,
      sessionId: newSessionId,
    });

    await rotateRefreshSession(
      userId,
      sessionId,
      userId,
      newSessionId,
      newRefreshToken,
    );

    const token = buildToken({ userId: user.id, email: user.email });
    setRefreshCookie(res, newRefreshToken);

    return sendSuccess(
      res,
      { user: toPublicUser(user), token },
      "Token refreshed successfully",
    );
  } catch (error) {
    const cause = error as Error;
    clearRefreshCookie(res);

    if (cause.name === "JsonWebTokenError") {
      return sendUnauthorized(res, "Invalid refresh token.");
    }
    if (cause.name === "TokenExpiredError") {
      return sendUnauthorized(res, "Refresh token expired.");
    }

    return sendServerError(res, "Internal server error", error);
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const refreshToken = getRefreshTokenFromRequest(req);

    if (refreshToken) {
      try {
        const decoded = verifyRefreshToken(refreshToken);
        if (decoded.userId && decoded.sessionId) {
          await revokeRefreshSession(decoded.userId, decoded.sessionId);
        }
      } catch {
        // If token is invalid or expired, cookie clear still logs user out.
      }
    }

    clearRefreshCookie(res);
    return sendSuccess(res, null, "Logged out successfully");
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

    await revokeAllRefreshSessionsForUser(userId);
    clearRefreshCookie(res);

    return sendSuccess(res, null, "Account deleted successfully");
  } catch (error) {
    return sendServerError(res, "Internal server error", error);
  }
};

export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { otp } = req.body;
    const user = req.user!;

    if (!otp) return sendError(res, "OTP is required", 400);

    // Get the code from Redis
    const storedOtp = await redis.get(`otp:${user.email}`);

    if (!storedOtp) {
      return sendError(
        res,
        "OTP expired or not found. Please request a new one.",
        400,
      );
    }

    if (storedOtp !== otp) {
      return sendError(res, "Invalid OTP code", 400);
    }

    // Success! Update User in DB
    await prisma.user.update({
      where: { id: user.id },
      data: { isVerified: true },
    });

    // Delete the OTP from Redis so it can't be used again
    await redis.del(`otp:${user.email}`);

    return sendSuccess(res, null, "Email verified successfully!");
  } catch (error) {
    return sendServerError(res, "Verification failed", error);
  }
};

export const resendOtp = async (req: Request, res: Response) => {
  try {
    const user = req.user!; // Provided by auth middleware

    // 1. Check if user is already verified
    if (user.isVerified) {
      return sendError(res, "This account is already verified.", 400);
    }

    // 2. Generate a new 6-digit OTP
    const otp = GenerateOTP();

    // 3. Update Redis with the new OTP and a fresh 15-minute expiration
    // Key: otp:email@example.com, EX: 900 seconds (15 mins)
    await redis.setex(`otp:${user.email}`, 900, otp);

    // 4. Send the email using your generic email service
    const emailSent = await emailService.sendMail({
      to: user.email,
      subject: "Your New Verification Code",
      template: "otp-verification",
      data: {
        name: user.name,
        otp: otp,
      },
    });

    if (!emailSent) {
      return sendError(
        res,
        "Failed to send verification email. Please try again.",
        500,
      );
    }

    return sendSuccess(
      res,
      null,
      "A new verification code has been sent to your email.",
    );
  } catch (error) {
    return sendServerError(
      res,
      "Internal server error during OTP resend.",
      error,
    );
  }
};
