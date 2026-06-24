import type { Request, Response, NextFunction } from "express";
import prisma from "../config/db.js";
import {
  sendError,
  sendNotFound,
  sendServerError,
  sendSuccess,
} from "../utils/response.js";

// ── Helpers ──────────────────────────────────────────────────────────────── //

const USER_PUBLIC_SELECT = {
  id: true,
  email: true,
  name: true,
  role: true,
  contactNumber: true,
  profilePhotoUrl: true,
  isVerified: true,
  createdAt: true,
  deletedAt: true,
} as const;

// ── Admin: List Users ─────────────────────────────────────────────────────── //

export const adminListUsers = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const {
      page = "1",
      limit = "20",
      role,
      search,
      sortBy = "createdAt",
      sortDir = "desc",
    } = req.query as Record<string, string | undefined>;

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
    const skip = (pageNum - 1) * limitNum;

    // Build filter
    const where: Record<string, any> = { deletedAt: null };

    if (role && ["Customer", "StoreOwner", "Admin"].includes(role)) {
      where.role = role;
    }

    if (search && search.trim()) {
      where.OR = [
        { name: { contains: search.trim(), mode: "insensitive" } },
        { email: { contains: search.trim(), mode: "insensitive" } },
      ];
    }

    // Build ordering
    const allowedSortFields = ["createdAt", "name", "email"] as const;
    const safeSortBy = allowedSortFields.includes(
      sortBy as (typeof allowedSortFields)[number],
    )
      ? sortBy
      : "createdAt";
    const safeSortDir = sortDir === "asc" ? "asc" : "desc";

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: USER_PUBLIC_SELECT,
        orderBy: { [safeSortBy]: safeSortDir },
        skip,
        take: limitNum,
      }),
      prisma.user.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limitNum);

    return sendSuccess(
      res,
      {
        users,
        meta: { total, totalPages, page: pageNum, limit: limitNum },
      },
      "Users retrieved successfully",
    );
  } catch (error) {
    return sendServerError(res, "Failed to retrieve users", error);
  }
};

// ── Admin: Delete User ────────────────────────────────────────────────────── //

export const adminDeleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { userId } = req.params as { userId?: string };

    if (!userId) {
      return sendError(res, "userId is required", 400);
    }

    // Prevent admin from deleting themselves
    if (userId === req.user?.id) {
      return sendError(res, "Cannot delete your own account", 400);
    }

    const result = await prisma.user.updateMany({
      where: { id: userId, deletedAt: null },
      data: { deletedAt: new Date() },
    });

    if (result.count === 0) {
      return sendNotFound(res, "User not found or already deleted");
    }

    return sendSuccess(res, null, "User account deleted successfully");
  } catch (error) {
    return sendServerError(res, "Failed to delete user", error);
  }
};
