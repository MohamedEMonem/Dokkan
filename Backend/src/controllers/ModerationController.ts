import type { Request, Response, NextFunction } from "express";
import { ModerationService } from "../services/ModerationService.js";
import {
  createFlagSchema,
  updateFlagSchema,
  listFlagsQuerySchema,
} from "../DTO/moderation.dto.js";
import {
  sendError,
  sendNotFound,
  sendServerError,
  sendSuccess,
  sendValidationError,
} from "../utils/response.js";
import { meilisearchService } from "../services/meilisearchService.js";

//  Customer: Create Flag 

export const createFlag = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const validation = createFlagSchema.safeParse(req.body);

    if (!validation.success) {
      return sendValidationError(res, validation.error.format());
    }

    const flag = await ModerationService.createFlag(
      req.user!.id,
      validation.data,
    );

    return sendSuccess(res, { flag }, "Content flagged successfully", 201);
  } catch (error) {
    const cause = error as Error & { statusCode?: number };

    if (cause.statusCode) {
      return sendError(res, cause.message, cause.statusCode);
    }

    return sendServerError(res, "Failed to flag content", error);
  }
};

//  Admin: List Flags 

export const listFlags = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const validation = listFlagsQuerySchema.safeParse(req.query);

    if (!validation.success) {
      return sendValidationError(res, validation.error.format());
    }

    const result = await ModerationService.listFlags(validation.data);

    return sendSuccess(
      res,
      { flags: result.flags, meta: result.meta },
      "Flags retrieved successfully",
    );
  } catch (error) {
    return sendServerError(res, "Failed to retrieve flags", error);
  }
};

//  Admin: Get Single Flag 

export const getFlagById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { flagId } = req.params as { flagId?: string };

    if (!flagId) {
      return sendError(res, "flagId is required", 400);
    }

    const flag = await ModerationService.getFlagById(flagId);

    if (!flag) {
      return sendNotFound(res, "Flag not found");
    }

    return sendSuccess(res, { flag }, "Flag retrieved successfully");
  } catch (error) {
    return sendServerError(res, "Failed to retrieve flag", error);
  }
};

//  Admin: Update Flag Status 

export const updateFlagStatus = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { flagId } = req.params as { flagId?: string };

    if (!flagId) {
      return sendError(res, "flagId is required", 400);
    }

    const validation = updateFlagSchema.safeParse(req.body);

    if (!validation.success) {
      return sendValidationError(res, validation.error.format());
    }

    const flag = await ModerationService.updateFlagStatus(
      flagId,
      req.user!.id,
      validation.data,
    );

    return sendSuccess(res, { flag }, "Flag status updated successfully");
  } catch (error) {
    const cause = error as Error & { statusCode?: number };

    if (cause.statusCode) {
      return sendError(res, cause.message, cause.statusCode);
    }

    return sendServerError(res, "Failed to update flag status", error);
  }
};

//  Admin: Remove Product 

export const adminRemoveProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { productId } = req.params as { productId?: string };

    if (!productId) {
      return sendError(res, "productId is required", 400);
    }

    const product = await ModerationService.removeProduct(
      productId,
      req.user!.id,
    );

    meilisearchService.delete("products", productId);

    return sendSuccess(
      res,
      { product },
      "Product removed successfully",
    );
  } catch (error) {
    const cause = error as Error & { statusCode?: number };

    if (cause.statusCode) {
      return sendError(res, cause.message, cause.statusCode);
    }

    return sendServerError(res, "Failed to remove product", error);
  }
};

//  Admin: Remove Store 

export const adminRemoveStore = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { storeId } = req.params as { storeId?: string };

    if (!storeId) {
      return sendError(res, "storeId is required", 400);
    }

    const store = await ModerationService.removeStore(storeId, req.user!.id);

    meilisearchService.delete("stores", storeId);

    return sendSuccess(res, { store }, "Store suspended and removed successfully");
  } catch (error) {
    const cause = error as Error & { statusCode?: number };

    if (cause.statusCode) {
      return sendError(res, cause.message, cause.statusCode);
    }

    return sendServerError(res, "Failed to remove store", error);
  }
};

//  Admin: Remove Product Review

export const adminRemoveProductReview = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { reviewId } = req.params as { reviewId?: string };

    if (!reviewId) {
      return sendError(res, "reviewId is required", 400);
    }

    await ModerationService.removeProductReview(reviewId, req.user!.id);

    return sendSuccess(res, null, "Product review removed successfully");
  } catch (error) {
    const cause = error as Error & { statusCode?: number };

    if (cause.statusCode) {
      return sendError(res, cause.message, cause.statusCode);
    }

    return sendServerError(res, "Failed to remove product review", error);
  }
};

//  Admin: Remove Store Review 

export const adminRemoveStoreReview = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { reviewId } = req.params as { reviewId?: string };

    if (!reviewId) {
      return sendError(res, "reviewId is required", 400);
    }

    await ModerationService.removeStoreReview(reviewId, req.user!.id);

    return sendSuccess(res, null, "Store review removed successfully");
  } catch (error) {
    const cause = error as Error & { statusCode?: number };

    if (cause.statusCode) {
      return sendError(res, cause.message, cause.statusCode);
    }

    return sendServerError(res, "Failed to remove store review", error);
  }
};

//  Admin: Restore Actions 

export const adminRestoreProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { productId } = req.params as { productId?: string };
    if (!productId) return sendError(res, "productId is required", 400);
    const product = await ModerationService.restoreProduct(productId);
    meilisearchService.add("products", {
      id: product.id,
      title: product.title,
      description: product.description,
      price: Number(product.price),
      storeId: product.storeId,
      subCategoryId: product.subCategoryId,
    });
    return sendSuccess(res, { product }, "Product restored successfully");
  } catch (error) {
    const cause = error as Error & { statusCode?: number };
    if (cause.statusCode) return sendError(res, cause.message, cause.statusCode);
    return sendServerError(res, "Failed to restore product", error);
  }
};

export const adminRestoreStore = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { storeId } = req.params as { storeId?: string };
    if (!storeId) return sendError(res, "storeId is required", 400);
    const store = await ModerationService.restoreStore(storeId);
    meilisearchService.add("stores", {
      id: store.id,
      name: store.name,
      subdomain: store.subdomain,
      description: store.description,
      ownerId: store.ownerId,
    });
    return sendSuccess(res, { store }, "Store restored successfully");
  } catch (error) {
    const cause = error as Error & { statusCode?: number };
    if (cause.statusCode) return sendError(res, cause.message, cause.statusCode);
    return sendServerError(res, "Failed to restore store", error);
  }
};

export const adminRestoreProductReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { reviewId } = req.params as { reviewId?: string };
    if (!reviewId) return sendError(res, "reviewId is required", 400);
    const review = await ModerationService.restoreProductReview(reviewId);
    return sendSuccess(res, { review }, "Product review restored successfully");
  } catch (error) {
    const cause = error as Error & { statusCode?: number };
    if (cause.statusCode) return sendError(res, cause.message, cause.statusCode);
    return sendServerError(res, "Failed to restore product review", error);
  }
};

export const adminRestoreStoreReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { reviewId } = req.params as { reviewId?: string };
    if (!reviewId) return sendError(res, "reviewId is required", 400);
    const review = await ModerationService.restoreStoreReview(reviewId);
    return sendSuccess(res, { review }, "Store review restored successfully");
  } catch (error) {
    const cause = error as Error & { statusCode?: number };
    if (cause.statusCode) return sendError(res, cause.message, cause.statusCode);
    return sendServerError(res, "Failed to restore store review", error);
  }
};
