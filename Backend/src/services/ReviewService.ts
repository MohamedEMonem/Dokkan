import { Prisma } from "@prisma/client";
import prisma from "../config/db.js";
import type {
  CreateProductReviewDto,
  UpdateProductReviewDto,
  CreateStoreReviewDto,
  UpdateStoreReviewDto,
  ListReviewsQueryDto,
} from "../DTO/review.dto.js";

type ReviewSortBy = "createdAt" | "rating";
type ReviewSortDir = "asc" | "desc";

const httpError = (message: string, statusCode: number): never => {
  const error = new Error(message) as Error & { statusCode: number };
  error.statusCode = statusCode;
  throw error;
};

const toOrderBy = (sortBy: ReviewSortBy, sortDir: ReviewSortDir) =>
  ({ [sortBy]: sortDir });

// Rating Recalculation Helpers 

async function recalculateProductRating(
  productId: string,
  tx: Prisma.TransactionClient,
) {
  const aggregate = await tx.productReview.aggregate({
    where: { productId },
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
    where: { storeId },
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

// Product Review Service

export class ReviewService {
  // Product Reviews

  static async createProductReview(
    customerId: string,
    data: CreateProductReviewDto,
  ) {
    const { productId, orderId, rating, reviewText } = data;

    // Verify the order belongs to this customer & is Delivered
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        customerId,
        status: "Delivered",
        deletedAt: null,
      },
      include: {
        orderItems: { select: { productId: true } },
      },
    });

    if (!order) {
      return httpError(
        "Order not found, does not belong to you, or is not yet delivered",
        404,
      );
    }

    // Verify the product was actually in this order
    const productInOrder = order.orderItems.some(
      (item) => item.productId === productId,
    );

    if (!productInOrder) {
      return httpError("This product was not part of the specified order", 400);
    }

    // Check for duplicate review
    const existing = await prisma.productReview.findUnique({
      where: {
        productId_customerId_orderId: { productId, customerId, orderId },
      },
    });

    if (existing) {
      return httpError("You have already reviewed this product for this order", 409);
    }

    const review = await prisma.$transaction(async (tx) => {
      const created = await tx.productReview.create({
        data: {
          productId,
          customerId,
          orderId,
          rating,
          reviewText: reviewText ?? null,
        },
        include: {
          customer: { select: { id: true, name: true } },
        },
      });

      await recalculateProductRating(productId, tx);

      return created;
    });

    return review;
  }

  static async getProductReviews(productId: string, query: ListReviewsQueryDto, user?: { id: string; role?: string }) {
    const { page, limit, sortBy, sortDir } = query;
    const skip = (page - 1) * limit;

    let where: Prisma.ProductReviewWhereInput = { productId, deletedAt: null };
    if (user?.role === "Admin") {
      where = { productId };
    } else if (user?.role === "StoreOwner") {
      where = {
        productId,
        OR: [
          { deletedAt: null },
          { product: { store: { ownerId: user.id } } }
        ]
      };
    }
    const orderBy = toOrderBy(sortBy ?? "createdAt", sortDir ?? "desc");

    const [reviews, total] = await Promise.all([
      prisma.productReview.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          customer: { select: { id: true, name: true, profilePhotoUrl: true } },
        },
      }),
      prisma.productReview.count({ where }),
    ]);

    return {
      reviews,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  static async getProductReviewById(reviewId: string, user?: { id: string; role?: string }) {
    let where: Prisma.ProductReviewWhereInput = { id: reviewId, deletedAt: null };
    if (user?.role === "Admin") {
      where = { id: reviewId };
    } else if (user?.role === "StoreOwner") {
      where = {
        id: reviewId,
        OR: [
          { deletedAt: null },
          { product: { store: { ownerId: user.id } } }
        ]
      };
    }

    const review = await prisma.productReview.findFirst({
      where,
      include: {
        customer: { select: { id: true, name: true, profilePhotoUrl: true } },
        product: { select: { id: true, title: true } },
      },
    });

    return review;
  }

  static async updateProductReview(
    reviewId: string,
    customerId: string,
    data: UpdateProductReviewDto,
  ) {
    const review = await prisma.productReview.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      return httpError("Review not found", 404);
    }

    if (review.customerId !== customerId) {
      return httpError("You can only update your own reviews", 403);
    }

    const updateData: Prisma.ProductReviewUpdateInput = {};
    if (data.rating !== undefined) updateData.rating = data.rating;
    if (data.reviewText !== undefined) updateData.reviewText = data.reviewText;

    const updated = await prisma.$transaction(async (tx) => {
      const updatedReview = await tx.productReview.update({
        where: { id: reviewId },
        data: updateData,
        include: {
          customer: { select: { id: true, name: true } },
        },
      });

      if (data.rating !== undefined) {
        await recalculateProductRating(review.productId, tx);
      }

      return updatedReview;
    });

    return updated;
  }

  static async deleteProductReview(reviewId: string, customerId: string) {
    const review = await prisma.productReview.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      return httpError("Review not found", 404);
    }

    if (review.customerId !== customerId) {
      return httpError("You can only delete your own reviews", 403);
    }

    await prisma.$transaction(async (tx) => {
      await tx.productReview.delete({ where: { id: reviewId } });
      await recalculateProductRating(review.productId, tx);
    });
  }

  static async replyToProductReview(
    reviewId: string,
    userId: string,
    reply: string,
  ) {
    const review = await prisma.productReview.findUnique({
      where: { id: reviewId },
      include: {
        product: {
          select: {
            store: { select: { ownerId: true } },
          },
        },
      },
    });

    if (!review) {
      return httpError("Review not found", 404);
    }

    if (review.product.store.ownerId !== userId) {
      return httpError("Only the store owner can reply to this review", 403);
    }

    const updated = await prisma.productReview.update({
      where: { id: reviewId },
      data: {
        storeReply: reply,
        storeRepliedAt: new Date(),
      },
      include: {
        customer: { select: { id: true, name: true } },
      },
    });

    return updated;
  }

  // Store Reviews

  static async createStoreReview(
    customerId: string,
    data: CreateStoreReviewDto,
  ) {
    const { storeId, orderId, rating, reviewText } = data;

    // Verify the order belongs to this customer, targets this store, and is Delivered
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        customerId,
        storeId,
        status: "Delivered",
        deletedAt: null,
      },
    });

    if (!order) {
      return httpError(
        "Order not found, does not belong to you, is not from this store, or is not yet delivered",
        404,
      );
    }

    // Check for duplicate review
    const existing = await prisma.storeReview.findUnique({
      where: {
        storeId_customerId_orderId: { storeId, customerId, orderId },
      },
    });

    if (existing) {
      return httpError("You have already reviewed this store for this order", 409);
    }

    const review = await prisma.$transaction(async (tx) => {
      const created = await tx.storeReview.create({
        data: {
          storeId,
          customerId,
          orderId,
          rating,
          reviewText: reviewText ?? null,
        },
        include: {
          customer: { select: { id: true, name: true } },
        },
      });

      await recalculateStoreRating(storeId, tx);

      return created;
    });

    return review;
  }

  static async getStoreReviews(storeId: string, query: ListReviewsQueryDto, user?: { id: string; role?: string }) {
    const { page, limit, sortBy, sortDir } = query;
    const skip = (page - 1) * limit;

    let where: Prisma.StoreReviewWhereInput = { storeId, deletedAt: null };
    if (user?.role === "Admin") {
      where = { storeId };
    } else if (user?.role === "StoreOwner") {
      where = {
        storeId,
        OR: [
          { deletedAt: null },
          { store: { ownerId: user.id } }
        ]
      };
    }
    const orderBy = toOrderBy(sortBy ?? "createdAt", sortDir ?? "desc");

    const [reviews, total] = await Promise.all([
      prisma.storeReview.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          customer: { select: { id: true, name: true, profilePhotoUrl: true } },
        },
      }),
      prisma.storeReview.count({ where }),
    ]);

    return {
      reviews,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  static async getStoreReviewById(reviewId: string, user?: { id: string; role?: string }) {
    let where: Prisma.StoreReviewWhereInput = { id: reviewId, deletedAt: null };
    if (user?.role === "Admin") {
      where = { id: reviewId };
    } else if (user?.role === "StoreOwner") {
      where = {
        id: reviewId,
        OR: [
          { deletedAt: null },
          { store: { ownerId: user.id } }
        ]
      };
    }

    const review = await prisma.storeReview.findFirst({
      where,
      include: {
        customer: { select: { id: true, name: true, profilePhotoUrl: true } },
        store: { select: { id: true, name: true } },
      },
    });

    return review;
  }

  static async updateStoreReview(
    reviewId: string,
    customerId: string,
    data: UpdateStoreReviewDto,
  ) {
    const review = await prisma.storeReview.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      return httpError("Review not found", 404);
    }

    if (review.customerId !== customerId) {
      return httpError("You can only update your own reviews", 403);
    }

    const updateData: Prisma.StoreReviewUpdateInput = {};
    if (data.rating !== undefined) updateData.rating = data.rating;
    if (data.reviewText !== undefined) updateData.reviewText = data.reviewText;

    const updated = await prisma.$transaction(async (tx) => {
      const updatedReview = await tx.storeReview.update({
        where: { id: reviewId },
        data: updateData,
        include: {
          customer: { select: { id: true, name: true } },
        },
      });

      if (data.rating !== undefined) {
        await recalculateStoreRating(review.storeId, tx);
      }

      return updatedReview;
    });

    return updated;
  }

  static async deleteStoreReview(reviewId: string, customerId: string) {
    const review = await prisma.storeReview.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      return httpError("Review not found", 404);
    }

    if (review.customerId !== customerId) {
      return httpError("You can only delete your own reviews", 403);
    }

    await prisma.$transaction(async (tx) => {
      await tx.storeReview.delete({ where: { id: reviewId } });
      await recalculateStoreRating(review.storeId, tx);
    });
  }

  static async replyToStoreReview(
    reviewId: string,
    userId: string,
    reply: string,
  ) {
    const review = await prisma.storeReview.findUnique({
      where: { id: reviewId },
      include: {
        store: { select: { ownerId: true } },
      },
    });

    if (!review) {
      return httpError("Review not found", 404);
    }

    if (review.store.ownerId !== userId) {
      return httpError("Only the store owner can reply to this review", 403);
    }

    const updated = await prisma.storeReview.update({
      where: { id: reviewId },
      data: {
        storeReply: reply,
        storeRepliedAt: new Date(),
      },
      include: {
        customer: { select: { id: true, name: true } },
      },
    });

    return updated;
  }
}
