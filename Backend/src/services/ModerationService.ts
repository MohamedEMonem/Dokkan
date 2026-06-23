import { Prisma } from "@prisma/client";
import prisma from "../config/db.js";
import type {
  CreateFlagDto,
  UpdateFlagDto,
  ListFlagsQueryDto,
} from "../DTO/moderation.dto.js";

const httpError = (message: string, statusCode: number): never => {
  const error = new Error(message) as Error & { statusCode: number };
  error.statusCode = statusCode;
  throw error;
};

//  Rating Recalculation Helpers (mirroring ReviewService) 

async function recalculateProductRating(
  productId: string,
  tx: Prisma.TransactionClient,
) {
  const aggregate = await tx.productReview.aggregate({
    where: { productId, deletedAt: null },
    _avg: { rating: true },
    _count: { rating: true },
  });

  await tx.product.update({
    where: { id: productId },
    data: {
      averageRating: aggregate._avg.rating ?? 0,
      reviewCount: aggregate._count.rating,
    },
  });
}

async function recalculateStoreRating(
  storeId: string,
  tx: Prisma.TransactionClient,
) {
  const aggregate = await tx.storeReview.aggregate({
    where: { storeId, deletedAt: null },
    _avg: { rating: true },
    _count: { rating: true },
  });

  await tx.store.update({
    where: { id: storeId },
    data: {
      averageRating: aggregate._avg.rating ?? 0,
      reviewCount: aggregate._count.rating,
    },
  });
}

//  Helper to auto-resolve pending flags for a given target 

async function resolvePendingFlags(
  targetType: string,
  targetId: string,
  adminId: string,
  tx: Prisma.TransactionClient,
) {
  await tx.flag.updateMany({
    where: {
      targetType: targetType as any,
      targetId,
      status: "PENDING",
    },
    data: {
      status: "RESOLVED",
      resolvedById: adminId,
      adminNote: "Auto-resolved: target removed by admin",
    },
  });
}

//  Validate that the flag target actually exists 

async function validateTargetExists(
  targetType: string,
  targetId: string,
): Promise<void> {
  switch (targetType) {
    case "PRODUCT": {
      const product = await prisma.product.findFirst({
        where: { id: targetId, deletedAt: null },
        select: { id: true },
      });
      if (!product) return httpError("Product not found", 404);
      break;
    }
    case "STORE": {
      const store = await prisma.store.findFirst({
        where: { id: targetId, deletedAt: null },
        select: { id: true },
      });
      if (!store) return httpError("Store not found", 404);
      break;
    }
    case "PRODUCT_REVIEW": {
      const review = await prisma.productReview.findFirst({
        where: { id: targetId, deletedAt: null },
        select: { id: true },
      });
      if (!review) return httpError("Product review not found", 404);
      break;
    }
    case "STORE_REVIEW": {
      const review = await prisma.storeReview.findFirst({
        where: { id: targetId, deletedAt: null },
        select: { id: true },
      });
      if (!review) return httpError("Store review not found", 404);
      break;
    }
    default:
      return httpError("Invalid target type", 400);
  }
}

export class ModerationService {
  //  Flag CRUD 

  static async createFlag(reporterId: string, data: CreateFlagDto) {
    const { targetType, targetId, reason } = data;

    // Validate target exists
    await validateTargetExists(targetType, targetId);

    // Prevent duplicate active flags from same reporter on same target
    const existingFlag = await prisma.flag.findFirst({
      where: {
        reporterId,
        targetType,
        targetId,
        status: "PENDING",
      },
    });

    if (existingFlag) {
      httpError(
        "You already have a pending report for this item",
        409,
      );
    }

    const flag = await prisma.flag.create({
      data: {
        reporterId,
        targetType,
        targetId,
        reason,
      },
      include: {
        reporter: { select: { id: true, name: true, email: true } },
      },
    });

    return flag;
  }

  static async listFlags(query: ListFlagsQueryDto) {
    const { page, limit, status, targetType } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.FlagWhereInput = {};
    if (status) where.status = status;
    if (targetType) where.targetType = targetType;

    const [flags, total] = await Promise.all([
      prisma.flag.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        include: {
          reporter: { select: { id: true, name: true, email: true } },
          resolvedBy: { select: { id: true, name: true } },
        },
      }),
      prisma.flag.count({ where }),
    ]);

    return {
      flags,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async getFlagById(flagId: string) {
    const flag = await prisma.flag.findUnique({
      where: { id: flagId },
      include: {
        reporter: { select: { id: true, name: true, email: true } },
        resolvedBy: { select: { id: true, name: true } },
      },
    });

    return flag;
  }

  static async updateFlagStatus(
    flagId: string,
    adminId: string,
    data: UpdateFlagDto,
  ) {
    const flag = await prisma.flag.findUnique({
      where: { id: flagId },
      select: { id: true, status: true },
    });

    if (!flag) {
      httpError("Flag not found", 404);
    }

    const updated = await prisma.flag.update({
      where: { id: flagId },
      data: {
        status: data.status,
        adminNote: data.adminNote,
        resolvedById: data.status !== "PENDING" ? adminId : null,
      },
      include: {
        reporter: { select: { id: true, name: true, email: true } },
        resolvedBy: { select: { id: true, name: true } },
      },
    });

    return updated;
  }

  //  Admin Removal Actions 

  static async removeProduct(productId: string, adminId: string) {
    const product = await prisma.product.findFirst({
      where: { id: productId, deletedAt: null },
      select: { id: true, title: true, storeId: true },
    });

    if (!product) {
      return httpError("Product not found", 404);
    }

    const deleted = await prisma.$transaction(async (tx) => {
      const softDeleted = await tx.product.update({
        where: { id: productId },
        data: { deletedAt: new Date(), status: "Inactive" },
      });

      // Auto-resolve all pending flags on this product
      await resolvePendingFlags("PRODUCT", productId, adminId, tx);

      return softDeleted;
    });

    return deleted;
  }

  static async removeStore(storeId: string, adminId: string) {
    const store = await prisma.store.findFirst({
      where: { id: storeId, deletedAt: null },
      select: { id: true, name: true },
    });

    if (!store) {
      return httpError("Store not found", 404);
    }

    const suspended = await prisma.$transaction(async (tx) => {
      const updated = await tx.store.update({
        where: { id: storeId },
        data: {
          status: "Suspended",
          deletedAt: new Date(),
        },
      });

      // Auto-resolve all pending flags on this store
      await resolvePendingFlags("STORE", storeId, adminId, tx);

      return updated;
    });

    return suspended;
  }

  static async removeProductReview(reviewId: string, adminId: string) {
    const review = await prisma.productReview.findFirst({
      where: { id: reviewId, deletedAt: null },
      select: { id: true, productId: true },
    });

    if (!review) {
      return httpError("Product review not found", 404);
    }

    await prisma.$transaction(async (tx) => {
      await tx.productReview.update({ where: { id: reviewId }, data: { deletedAt: new Date() } });
      await recalculateProductRating(review.productId, tx);

      // Auto-resolve all pending flags on this review
      await resolvePendingFlags("PRODUCT_REVIEW", reviewId, adminId, tx);
    });
  }

  static async removeStoreReview(reviewId: string, adminId: string) {
    const review = await prisma.storeReview.findFirst({
      where: { id: reviewId, deletedAt: null },
      select: { id: true, storeId: true },
    });

    if (!review) {
      return httpError("Store review not found", 404);
    }

    await prisma.$transaction(async (tx) => {
      await tx.storeReview.update({ where: { id: reviewId }, data: { deletedAt: new Date() } });
      await recalculateStoreRating(review.storeId, tx);

      // Auto-resolve all pending flags on this review
      await resolvePendingFlags("STORE_REVIEW", reviewId, adminId, tx);
    });
  }

  //  Admin Restore Actions 

  static async restoreProduct(productId: string) {
    const product = await prisma.product.findFirst({
      where: { id: productId, deletedAt: { not: null } },
      select: { id: true },
    });

    if (!product) return httpError("Product not found or not deleted", 404);

    return prisma.product.update({
      where: { id: productId },
      data: { deletedAt: null, status: "Active" },
    });
  }

  static async restoreStore(storeId: string) {
    const store = await prisma.store.findFirst({
      where: { id: storeId, deletedAt: { not: null } },
      select: { id: true },
    });

    if (!store) return httpError("Store not found or not deleted", 404);

    return prisma.store.update({
      where: { id: storeId },
      data: { deletedAt: null, status: "Active" },
    });
  }

  static async restoreProductReview(reviewId: string) {
    const review = await prisma.productReview.findFirst({
      where: { id: reviewId, deletedAt: { not: null } },
      select: { id: true, productId: true },
    });

    if (!review) return httpError("Product review not found or not deleted", 404);

    return prisma.$transaction(async (tx) => {
      const restored = await tx.productReview.update({
        where: { id: reviewId },
        data: { deletedAt: null },
      });
      await recalculateProductRating(review.productId, tx);
      return restored;
    });
  }

  static async restoreStoreReview(reviewId: string) {
    const review = await prisma.storeReview.findFirst({
      where: { id: reviewId, deletedAt: { not: null } },
      select: { id: true, storeId: true },
    });

    if (!review) return httpError("Store review not found or not deleted", 404);

    return prisma.$transaction(async (tx) => {
      const restored = await tx.storeReview.update({
        where: { id: reviewId },
        data: { deletedAt: null },
      });
      await recalculateStoreRating(review.storeId, tx);
      return restored;
    });
  }
}
