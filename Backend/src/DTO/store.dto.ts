// @ts-ignore - zod type resolution may fail in this environment while runtime import remains valid
import { z } from "zod";
import { optional } from "zod/mini";

export const listStoresQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(20),
  status: z.enum(["Pending", "Active", "Suspended"]).optional(),
  sortBy: z.enum(["createdAt", "name", "status"]).optional().default("createdAt"),
  sortDir: z.enum(["asc", "desc"]).optional().default("desc"),
  subdomain: z.string().optional(),
});

const storePayloadSchema = z.object({
  name: z.string().min(1, "Store name is required"),
  subdomain: z
    .string()
    .min(3, "Subdomain must be at least 3 characters")
    .max(63, "Subdomain cannot exceed 63 characters")
    .regex(
      /^[a-z0-9-]+$/,
      "Subdomain can only contain lowercase letters, numbers, and hyphens",
    )
    .refine((val: string) => !["admin", "api", "www", "support", "dokkan"].includes(val), {
      message: "This subdomain is a reserved keyword and cannot be used",
    }),
  logoUrl: z.string().min(1, "Logo URL is required").optional(),
  description: z.string().optional(),
  coverBannerUrl: z.string().optional(),
  businessAddress: z.string().optional(),
  vatNumber: z.string().optional(),
  themeSettings: z.any().optional(),
  supportEmail: z.string().email().optional(),
  phoneNumber: z.string().optional(),
  operatingHours: z.string().optional(),
  socialMediaLinks: z.string().optional(),
});

export const createStoreSchema = z.object({
  data: storePayloadSchema,
});

export const updatestoreSchema = z.object({
  data: storePayloadSchema.partial(),
});

export const storeResponseSchema = z.object({
  id: z.string(),
  ownerId: z.string(),
  name: z.string(),
  subdomain: z.string(),
  status: z.string(),
  description: z.string().nullable(),
  logoUrl: z.string().nullable(),
  coverBannerUrl: z.string().nullable(),
  businessAddress: z.string().nullable(),
  vatNumber: z.string().nullable(),
  themeSettings: z.unknown().nullable(),
  createdAt: z.date().nullable(),
  deletedAt: z.date().nullable(),
});

export type ListStoresQueryDto = z.infer<typeof listStoresQuerySchema>;
export type StoreResponseDto = z.infer<typeof storeResponseSchema>;
export type updateStoreDto = z.infer<typeof updatestoreSchema>["data"];
export type CreateStoreDto = z.infer<typeof createStoreSchema>["data"];