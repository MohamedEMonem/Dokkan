// @ts-ignore - zod type resolution may fail in this environment while runtime import remains valid
import { z } from "zod";

export const createFlagSchema = z.object({
  targetType: z.enum(["PRODUCT", "STORE", "PRODUCT_REVIEW", "STORE_REVIEW"], {
    message:
      "targetType must be one of: PRODUCT, STORE, PRODUCT_REVIEW, STORE_REVIEW",
  }),
  targetId: z.string().uuid("targetId must be a valid UUID"),
  reason: z
    .string()
    .min(10, "Reason must be at least 10 characters")
    .max(2000, "Reason cannot exceed 2000 characters"),
});

export const updateFlagSchema = z.object({
  status: z.enum(["PENDING", "RESOLVED", "DISMISSED"], {
    message: "status must be one of: PENDING, RESOLVED, DISMISSED",
  }),
  adminNote: z
    .string()
    .max(2000, "Admin note cannot exceed 2000 characters")
    .optional(),
});


export const listFlagsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(20),
  status: z.enum(["PENDING", "RESOLVED", "DISMISSED"]).optional(),
  targetType: z
    .enum(["PRODUCT", "STORE", "PRODUCT_REVIEW", "STORE_REVIEW"])
    .optional(),
});

export type CreateFlagDto = z.infer<typeof createFlagSchema>;
export type UpdateFlagDto = z.infer<typeof updateFlagSchema>;
export type ListFlagsQueryDto = z.infer<typeof listFlagsQuerySchema>;
