import { randomInt, randomUUID } from "crypto";
import { UserRole } from "@prisma/client";
import jwt, { type JwtPayload, type SignOptions } from "jsonwebtoken";
import prisma from "../config/db.js";
import redis from "../config/redis.js";
import type {
  LoginAuthDto,
  OtpDto,
  RegisterAuthDto,
} from "../DTO/auth.dto.js";
import { hashPassword, verifyPassword } from "../utils/password.js";
import { emailService } from "./email.service.js";
import { OAuth2Client } from 'google-auth-library';

const googleClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.CORS_ORIGIN ? `${process.env.CORS_ORIGIN}/auth/callback` : 'http://localhost:5000/auth/callback'
);

type PublicUser = {
  id: string;
  email: string;
  name: string | null;
  role: UserRole;
  contactNumber: string | null;
  profilePhotoUrl: string | null;
  isVerified: boolean;
  createdAt: Date | null;
};

type AuthUser = PublicUser & {
  password?: string | null; // Updated to reflect optional password
  deletedAt: Date | null;
};

type RefreshTokenPayload = JwtPayload & {
  userId: string;
  email: string;
  sessionId: string;
};

type AuthServiceResult = {
  user: PublicUser;
  token: string;
  refreshToken: string;
  message: string;
  statusCode: number;
};

function createHttpError(message: string, statusCode: number) {
  const error = new Error(message) as Error & { statusCode?: number };
  error.statusCode = statusCode;
  return error;
}

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

function toPublicUser(user: AuthUser): PublicUser {
  return {
    id: user.id,
    email: user.email,
    name: user.name?.trim() || null,
    role: user.role,
    contactNumber: user.contactNumber,
    profilePhotoUrl: user.profilePhotoUrl,
    isVerified: user.isVerified,
    createdAt: user.createdAt,
  };
}

function generateOtp(length: number = 6): string {
  const min = Math.pow(10, length - 1);
  const max = Math.pow(10, length);
  return randomInt(min, max).toString();
}

function verifyRefreshToken(refreshToken: string): RefreshTokenPayload {
  return jwt.verify(refreshToken, getRefreshTokenSecret()) as RefreshTokenPayload;
}

async function saveRefreshSession(
  userId: string,
  sessionId: string,
  refreshToken: string,
) {
  await redis.setex(
    `${getRefreshKeyPrefix()}:${userId}:${sessionId}`,
    getRefreshTtlSeconds(),
    refreshToken,
  );
}

async function isRefreshSessionValid(
  userId: string,
  sessionId: string,
  refreshToken: string,
) {
  const storedToken = await redis.get(
    `${getRefreshKeyPrefix()}:${userId}:${sessionId}`,
  );
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
  multi.del(`${getRefreshKeyPrefix()}:${oldUserId}:${oldSessionId}`);
  multi.setex(
    `${getRefreshKeyPrefix()}:${newUserId}:${newSessionId}`,
    getRefreshTtlSeconds(),
    newRefreshToken,
  );
  await multi.exec();
}

async function revokeRefreshSession(userId: string, sessionId: string) {
  await redis.del(`${getRefreshKeyPrefix()}:${userId}:${sessionId}`);
}

async function issueRefreshToken(userId: string, email: string) {
  const sessionId = randomUUID();
  const refreshToken = buildRefreshToken({ userId, email, sessionId });
  await saveRefreshSession(userId, sessionId, refreshToken);
  return { refreshToken };
}

export const authService = {
  generateOtp: generateOtp,

  // --- GOOGLE LOGIN INTEGRATED HERE ---
  async loginWithGoogle(code: string): Promise<AuthServiceResult> {
    const { tokens } = await googleClient.getToken(code);

    const ticket = await googleClient.verifyIdToken({
      idToken: tokens.id_token!,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) throw createHttpError("Invalid Google Payload", 400);

    if (!payload.email_verified) {
      throw createHttpError("Google email is not verified. Cannot trust identity.", 403);
    }

    const { email } = payload;
    const normalizedEmail = email!.trim().toLowerCase();

    let user = await prisma.user.findFirst({
      where: { email: normalizedEmail }
    });

    if (!user) {
      throw createHttpError("User not found. Please sign up.", 404);
    }

    if (user.deletedAt) {
      throw createHttpError("This account has been deleted.", 401);
    }

    return {
      user: toPublicUser(user),
      token: buildToken({ userId: user.id, email: user.email }),
      refreshToken: (await issueRefreshToken(user.id, user.email)).refreshToken,
      message: "Logged in successfully with Google",
      statusCode: 200,
    };
  },

  async signupWithGoogle(code: string, role: UserRole): Promise<AuthServiceResult> {
    // 1. Exchange code for tokens
    const { tokens } = await googleClient.getToken(code);

    // 2. Verify the ID token
    const ticket = await googleClient.verifyIdToken({
      idToken: tokens.id_token!,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) throw createHttpError("Invalid Google Payload", 400);

    if (!payload.email_verified) {
      throw createHttpError("Google email is not verified. Cannot trust identity.", 403);
    }

    const { email, name, sub: googleOauthId } = payload;
    const normalizedEmail = email!.trim().toLowerCase();

    // 3. Find or create the user in the database
    let user = await prisma.user.findFirst({
      where: { email: normalizedEmail }
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: normalizedEmail,
          name: name!,
          role: role,
          googleOauthId: googleOauthId,
          isVerified: true,
          // Google emails are already verified
          // Note: password is omitted entirely since it's optional
        },
      });
    } else if (!user.googleOauthId) {
      // Link existing account to Google
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          googleOauthId: googleOauthId,
          isVerified: true,
          ...(user.isVerified === false && { password: null }) // Invalidate password if previously unverified
        },
      });
    }

    if (user.deletedAt) {
      const restoredUser = await prisma.user.update({
        where: { id: user.id },
        data: {
          email: normalizedEmail,
          role: role,
          deletedAt: null,
          isVerified: true,
          googleOauthId: googleOauthId,
        },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          contactNumber: true,
          profilePhotoUrl: true,
          isVerified: true,
          createdAt: true,
          password: true,
          deletedAt: true,
        },
      });

      return {
        user: toPublicUser(restoredUser),
        token: buildToken({ userId: restoredUser.id, email: restoredUser.email }),
        refreshToken: (await issueRefreshToken(restoredUser.id, restoredUser.email)).refreshToken,
        message: "Logged in successfully with Google",
        statusCode: 200,
      };
    }

    // 4. Generate your Dokkan Tokens and Redis Session
    const token = buildToken({ userId: user.id, email: user.email });
    const { refreshToken } = await issueRefreshToken(user.id, user.email);

    return {
      user: toPublicUser(user as AuthUser),
      token,
      refreshToken,
      message: "Logged in successfully with Google",
      statusCode: 200,
    };

  },



  async register(input: RegisterAuthDto, otp: string): Promise<AuthServiceResult> {
    const normalizedEmail = input.email.trim().toLowerCase();
    const normalizedName = input.name.trim();
    const userRole =
      input.role === "StoreOwner" ? UserRole.StoreOwner : UserRole.Customer;

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
        const hashedPassword = await hashPassword(input.password);

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
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
            contactNumber: true,
            profilePhotoUrl: true,
            isVerified: true,
            createdAt: true,
            password: true,
            deletedAt: true,
          },
        });

        const token = buildToken({
          userId: restoredUser.id,
          email: restoredUser.email,
        });
        const { refreshToken } = await issueRefreshToken(
          restoredUser.id,
          restoredUser.email,
        );

        const otpCode = otp;
        await redis.setex(`otp:${restoredUser.email}`, 900, otpCode);
        await emailService.sendMail({
          to: restoredUser.email,
          subject: "Verify your Dokkan Account",
          template: "otp-verification",
          data: { name: restoredUser.name, otp: otpCode },
        });

        return {
          user: toPublicUser(restoredUser),
          token,
          refreshToken,
          message:
            "Account restored and registered successfully, Please check your email for the verification code.",
          statusCode: 200,
        };
      }

      throw createHttpError("User already exists", 409);
    }

    const hashedPassword = await hashPassword(input.password);

    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        password: hashedPassword,
        name: normalizedName,
        role: userRole,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        contactNumber: true,
        profilePhotoUrl: true,
        isVerified: true,
        createdAt: true,
        password: true,
        deletedAt: true,
      },
    });

    const token = buildToken({ userId: user.id, email: user.email });
    const { refreshToken } = await issueRefreshToken(user.id, user.email);

    await redis.setex(`otp:${user.email}`, 900, otp);
    await emailService.sendMail({
      to: user.email,
      subject: "Verify your Dokkan Account",
      template: "otp-verification",
      data: { name: user.name, otp },
    });

    return {
      user: toPublicUser(user),
      token,
      refreshToken,
      message:
        "User created successfully, Please check your email for the verification code.",
      statusCode: 201,
    };
  },

  async login(input: LoginAuthDto): Promise<AuthServiceResult> {
    const normalizedEmail = input.email.trim().toLowerCase();

    const user = await prisma.user.findFirst({
      where: {
        email: {
          equals: normalizedEmail,
          mode: "insensitive",
        },
      },
      select: {
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
      },
    });

    if (!user) {
      throw createHttpError("Invalid email or password", 401);
    }

    if (user.deletedAt) {
      throw createHttpError("This account has been deleted.", 401);
    }

    // Explicit check for users who only registered via Google and don't have a password
    if (!user.password) {
      throw createHttpError("Please sign in with Google.", 401);
    }

    const isPasswordValid = await verifyPassword(input.password, user.password);
    if (!isPasswordValid) {
      throw createHttpError("Invalid email or password", 401);
    }

    const token = buildToken({ userId: user.id, email: user.email });
    const { refreshToken } = await issueRefreshToken(user.id, user.email);

    return {
      user: toPublicUser(user),
      token,
      refreshToken,
      message: "Logged in successfully",
      statusCode: 200,
    };
  },

  async refresh(refreshToken: string): Promise<AuthServiceResult> {
    const decoded = verifyRefreshToken(refreshToken);
    const userId = decoded.userId;
    const sessionId = decoded.sessionId;

    if (!userId || !decoded.email || !sessionId) {
      throw createHttpError("Invalid refresh token payload.", 401);
    }

    const isSessionValid = await isRefreshSessionValid(
      userId,
      sessionId,
      refreshToken,
    );
    if (!isSessionValid) {
      throw createHttpError("Invalid or revoked refresh token.", 401);
    }

    const user = await prisma.user.findFirst({
      where: {
        id: userId,
        deletedAt: null,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        contactNumber: true,
        profilePhotoUrl: true,
        isVerified: true,
        createdAt: true,
        password: true,
        deletedAt: true,
      },
    });

    if (!user) {
      await revokeRefreshSession(userId, sessionId);
      throw createHttpError("Account has been deleted or disabled.", 401);
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

    return {
      user: toPublicUser(user),
      token,
      refreshToken: newRefreshToken,
      message: "Token refreshed successfully",
      statusCode: 200,
    };
  },

  async logout(refreshToken?: string | null): Promise<void> {
    if (!refreshToken) return;

    try {
      const decoded = verifyRefreshToken(refreshToken);
      if (decoded.userId && decoded.sessionId) {
        await revokeRefreshSession(decoded.userId, decoded.sessionId);
      }
    } catch {
      // Best-effort logout: expired/invalid tokens still clear the cookie.
    }
  },

  async verifyOtp(user: { id: string; email: string }, otp: OtpDto["otp"]): Promise<void> {
    const storedOtp = await redis.get(`otp:${user.email}`);

    if (!storedOtp) {
      throw createHttpError(
        "OTP expired or not found. Please request a new one.",
        400,
      );
    }

    if (storedOtp !== otp) {
      throw createHttpError("Invalid OTP code", 400);
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { isVerified: true },
    });

    await redis.del(`otp:${user.email}`);
  },

  async resendOtp(user: { id: string; email: string; name?: string | null; isVerified?: boolean }): Promise<void> {
    if (user.isVerified) {
      throw createHttpError("This account is already verified.", 400);
    }

    const otp = generateOtp();
    await redis.setex(`otp:${user.email}`, 900, otp);

    const emailSent = await emailService.sendMail({
      to: user.email,
      subject: "Your New Verification Code",
      template: "otp-verification",
      data: {
        name: user.name,
        otp,
      },
    });

    if (!emailSent) {
      throw createHttpError("Failed to send verification email. Please try again.", 500);
    }
  },
};

export type { PublicUser, AuthServiceResult };