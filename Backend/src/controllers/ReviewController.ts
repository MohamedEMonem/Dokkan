import type { Request, Response } from "express";
import { ReviewService } from "../services/ReviewService.js";
import {
  createProductReviewSchema,
  createStoreReviewSchema,
  updateProductReviewSchema,
  updateStoreReviewSchema,
  storeReplySchema,
  listReviewsQuerySchema,
} from "../DTO/review.dto.js";
import {
  sendError,
  sendNotFound,
  sendServerError,
  sendSuccess,
  sendValidationError,
} from "../utils/response.js";

//  Product Review Handlers 

export const createProductReview = async (req: Request, res: Response) => {
  try {
    const validation = createProductReviewSchema.safeParse(req.body);

    if (!validation.success) {
      return sendValidationError(res, validation.error.format());
    }

    const review = await ReviewService.createProductReview(
      req.user!.id,
      validation.data,
    );

    return sendSuccess(res, { review }, "Product review created successfully", 201);
  } catch (error) {
    const cause = error as Error & { statusCode?: number };

    if (cause.statusCode) {
      return sendError(res, cause.message, cause.statusCode);
    }

    return sendServerError(res, "Failed to create product review", error);
  }
};

export const getProductReviews = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params as { productId?: string };

    if (!productId) {
      return sendError(res, "productId is required", 400);
    }

    const validation = listReviewsQuerySchema.safeParse(req.query);

    if (!validation.success) {
      return sendValidationError(res, validation.error.format());
    }

    const result = await ReviewService.getProductReviews(
      productId,
      validation.data,
    );

    return sendSuccess(
      res,
      {
        reviews: result.reviews,
        meta: {
          page: result.page,
          limit: result.limit,
          total: result.total,
          totalPages: result.totalPages,
        },
      },
      "Product reviews retrieved successfully",
    );
  } catch (error) {
    return sendServerError(res, "Failed to retrieve product reviews", error);
  }
};

export const getProductReviewById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id?: string };

    if (!id) {
      return sendError(res, "Review id is required", 400);
    }

    const review = await ReviewService.getProductReviewById(id);

    if (!review) {
      return sendNotFound(res, "Product review not found");
    }

    return sendSuccess(res, { review }, "Product review retrieved successfully");
  } catch (error) {
    return sendServerError(res, "Failed to retrieve product review", error);
  }
};

export const updateProductReview = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id?: string };

    if (!id) {
      return sendError(res, "Review id is required", 400);
    }

    const validation = updateProductReviewSchema.safeParse(req.body);

    if (!validation.success) {
      return sendValidationError(res, validation.error.format());
    }

    const review = await ReviewService.updateProductReview(
      id,
      req.user!.id,
      validation.data,
    );

    return sendSuccess(res, { review }, "Product review updated successfully");
  } catch (error) {
    const cause = error as Error & { statusCode?: number };

    if (cause.statusCode) {
      return sendError(res, cause.message, cause.statusCode);
    }

    return sendServerError(res, "Failed to update product review", error);
  }
};

export const deleteProductReview = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id?: string };

    if (!id) {
      return sendError(res, "Review id is required", 400);
    }

    await ReviewService.deleteProductReview(id, req.user!.id);

    return sendSuccess(res, null, "Product review deleted successfully");
  } catch (error) {
    const cause = error as Error & { statusCode?: number };

    if (cause.statusCode) {
      return sendError(res, cause.message, cause.statusCode);
    }

    return sendServerError(res, "Failed to delete product review", error);
  }
};

export const replyToProductReview = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id?: string };

    if (!id) {
      return sendError(res, "Review id is required", 400);
    }

    const validation = storeReplySchema.safeParse(req.body);

    if (!validation.success) {
      return sendValidationError(res, validation.error.format());
    }

    const review = await ReviewService.replyToProductReview(
      id,
      req.user!.id,
      validation.data.reply,
    );

    return sendSuccess(res, { review }, "Reply added successfully");
  } catch (error) {
    const cause = error as Error & { statusCode?: number };

    if (cause.statusCode) {
      return sendError(res, cause.message, cause.statusCode);
    }

    return sendServerError(res, "Failed to reply to product review", error);
  }
};

//  Store Review Handlers 

export const createStoreReview = async (req: Request, res: Response) => {
  try {
    const validation = createStoreReviewSchema.safeParse(req.body);

    if (!validation.success) {
      return sendValidationError(res, validation.error.format());
    }

    const review = await ReviewService.createStoreReview(
      req.user!.id,
      validation.data,
    );

    return sendSuccess(res, { review }, "Store review created successfully", 201);
  } catch (error) {
    const cause = error as Error & { statusCode?: number };

    if (cause.statusCode) {
      return sendError(res, cause.message, cause.statusCode);
    }

    return sendServerError(res, "Failed to create store review", error);
  }
};

export const getStoreReviews = async (req: Request, res: Response) => {
  try {
    const { storeId } = req.params as { storeId?: string };

    if (!storeId) {
      return sendError(res, "storeId is required", 400);
    }

    const validation = listReviewsQuerySchema.safeParse(req.query);

    if (!validation.success) {
      return sendValidationError(res, validation.error.format());
    }

    const result = await ReviewService.getStoreReviews(
      storeId,
      validation.data,
    );

    return sendSuccess(
      res,
      {
        reviews: result.reviews,
        meta: {
          page: result.page,
          limit: result.limit,
          total: result.total,
          totalPages: result.totalPages,
        },
      },
      "Store reviews retrieved successfully",
    );
  } catch (error) {
    return sendServerError(res, "Failed to retrieve store reviews", error);
  }
};

export const getStoreReviewById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id?: string };

    if (!id) {
      return sendError(res, "Review id is required", 400);
    }

    const review = await ReviewService.getStoreReviewById(id);

    if (!review) {
      return sendNotFound(res, "Store review not found");
    }

    return sendSuccess(res, { review }, "Store review retrieved successfully");
  } catch (error) {
    return sendServerError(res, "Failed to retrieve store review", error);
  }
};

export const updateStoreReview = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id?: string };

    if (!id) {
      return sendError(res, "Review id is required", 400);
    }

    const validation = updateStoreReviewSchema.safeParse(req.body);

    if (!validation.success) {
      return sendValidationError(res, validation.error.format());
    }

    const review = await ReviewService.updateStoreReview(
      id,
      req.user!.id,
      validation.data,
    );

    return sendSuccess(res, { review }, "Store review updated successfully");
  } catch (error) {
    const cause = error as Error & { statusCode?: number };

    if (cause.statusCode) {
      return sendError(res, cause.message, cause.statusCode);
    }

    return sendServerError(res, "Failed to update store review", error);
  }
};

export const deleteStoreReview = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id?: string };

    if (!id) {
      return sendError(res, "Review id is required", 400);
    }

    await ReviewService.deleteStoreReview(id, req.user!.id);

    return sendSuccess(res, null, "Store review deleted successfully");
  } catch (error) {
    const cause = error as Error & { statusCode?: number };

    if (cause.statusCode) {
      return sendError(res, cause.message, cause.statusCode);
    }

    return sendServerError(res, "Failed to delete store review", error);
  }
};

export const replyToStoreReview = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id?: string };

    if (!id) {
      return sendError(res, "Review id is required", 400);
    }

    const validation = storeReplySchema.safeParse(req.body);

    if (!validation.success) {
      return sendValidationError(res, validation.error.format());
    }

    const review = await ReviewService.replyToStoreReview(
      id,
      req.user!.id,
      validation.data.reply,
    );

    return sendSuccess(res, { review }, "Reply added successfully");
  } catch (error) {
    const cause = error as Error & { statusCode?: number };

    if (cause.statusCode) {
      return sendError(res, cause.message, cause.statusCode);
    }

    return sendServerError(res, "Failed to reply to store review", error);
  }
};
