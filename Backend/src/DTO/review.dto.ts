import { z } from "zod";

//  Shared

const ratingSchema = z.coerce.number().int().min(1).max(5);

const reviewSortByValues = ["createdAt", "rating"] as const;
const reviewSortDirValues = ["asc", "desc"] as const;

export const listReviewsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(20),
  sortBy: z.enum(reviewSortByValues).optional().default("createdAt"),
  sortDir: z.enum(reviewSortDirValues).optional().default("desc"),
});

//  Product Review 

export const createProductReviewSchema = z.object({
  productId: z.string().uuid("productId must be a valid UUID"),
  orderId: z.string().uuid("orderId must be a valid UUID"),
  rating: ratingSchema,
  reviewText: z.string().trim().max(2000).optional(),
});

export const updateProductReviewSchema = z.object({
  rating: ratingSchema.optional(),
  reviewText: z.string().trim().max(2000).optional(),
}).refine(data => data.rating !== undefined || data.reviewText !== undefined, "At least one field must be updated");

//  Store Review 

export const createStoreReviewSchema = z.object({
  storeId: z.string().uuid("storeId must be a valid UUID"),
  orderId: z.string().uuid("orderId must be a valid UUID"),
  rating: ratingSchema,
  reviewText: z.string().trim().max(2000).optional(),
});

export const updateStoreReviewSchema = z.object({
  rating: ratingSchema.optional(),
  reviewText: z.string().trim().max(2000).optional(),
}).refine(data => data.rating !== undefined || data.reviewText !== undefined, "At least one field must be updated");

//  Store Owner Reply 

export const storeReplySchema = z.object({
  reply: z.string().trim().min(1, "Reply cannot be empty").max(2000),
});

//  Types 

export type ListReviewsQueryDto = z.infer<typeof listReviewsQuerySchema>;
export type CreateProductReviewDto = z.infer<typeof createProductReviewSchema>;
export type UpdateProductReviewDto = z.infer<typeof updateProductReviewSchema>;
export type CreateStoreReviewDto = z.infer<typeof createStoreReviewSchema>;
export type UpdateStoreReviewDto = z.infer<typeof updateStoreReviewSchema>;
export type StoreReplyDto = z.infer<typeof storeReplySchema>;
