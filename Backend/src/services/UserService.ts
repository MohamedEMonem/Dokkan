import prisma from "../config/db.js";
import redis from "../config/redis.js";
import type { PatchProfileDto } from "../DTO/user.dto.js";

type PublicUser = {
  id: string;
  email: string;
  name: string | null;
  role: string;
  contactNumber: string | null;
  profilePhotoUrl: string | null;
  isVerified: boolean;
  createdAt: Date | null;
};

function createHttpError(message: string, statusCode: number) {
  const error = new Error(message) as Error & { statusCode?: number };
  error.statusCode = statusCode;
  return error;
}

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

function toPublicUser(user: PublicUser) {
  return {
    ...user,
    name: user.name?.trim() || null,
  };
}

async function revokeAllRefreshSessionsForUser(userId: string) {
  const keys = await redis.keys(`refresh:${userId}:*`);
  if (keys.length > 0) {
    await redis.del(...keys);
  }
}

export const userService = {
  async getProfile(userId: string) {
    const user = await prisma.user.findFirst({
      where: {
        id: userId,
        deletedAt: null,
      },
      select: USER_PUBLIC_SELECT,
    });

    if (!user) {
      throw createHttpError("User not found", 404);
    }

    return toPublicUser(user);
  },

  async patchProfile(userId: string, input: PatchProfileDto) {
    const data: Record<string, string | null> = {};

    if (Object.prototype.hasOwnProperty.call(input, "name")) {
      if (input.name === undefined) {
        throw createHttpError("name must be a non-empty string", 400);
      }

      data.name = input.name.trim();
    }

    if (Object.prototype.hasOwnProperty.call(input, "contactNumber")) {
      data.contactNumber = input.contactNumber ?? null;
    }

    if (Object.prototype.hasOwnProperty.call(input, "profilePhotoUrl")) {
      data.profilePhotoUrl = input.profilePhotoUrl ?? null;
    }

    if (Object.keys(data).length === 0) {
      throw createHttpError("No valid fields provided for update", 400);
    }

    const result = await prisma.user.updateMany({
      where: {
        id: userId,
        deletedAt: null,
      },
      data,
    });

    if (result.count === 0) {
      throw createHttpError("Account not found or already deleted", 404);
    }

    const updatedUser = await prisma.user.findFirst({
      where: {
        id: userId,
        deletedAt: null,
      },
      select: USER_PUBLIC_SELECT,
    });

    if (!updatedUser) {
      throw createHttpError("Account not found or already deleted", 404);
    }

    return toPublicUser(updatedUser);
  },

  async deleteAccount(userId: string) {
    const result = await prisma.user.updateMany({
      where: {
        id: userId,
        deletedAt: null,
      },
      data: { deletedAt: new Date() },
    });

    if (result.count === 0) {
      throw createHttpError("Account not found or already deleted", 404);
    }

    await revokeAllRefreshSessionsForUser(userId);
  },
};

export type { PublicUser };