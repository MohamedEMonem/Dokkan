import { z } from "zod";

// ─── Create Order ────────────────────────────────────────────────────────────

export const createOrderSchema = z.object({
  storeId: z.string().uuid("storeId must be a valid UUID"),
  shippingAddress: z.object({
    line1: z.string().trim().min(1, "line1 is required"),
    line2: z.string().trim().optional(),
    city: z.string().trim().min(1, "city is required"),
    country: z.string().trim().min(1, "country is required"),
    postalCode: z.string().trim().optional(),
  }),
});

// ─── Update Order Status ─────────────────────────────────────────────────────

export const updateOrderStatusSchema = z.object({
  status: z.enum(["Pending", "Shipped", "Delivered", "Cancelled"], {
    message: "status must be one of: Pending, Shipped, Delivered, Cancelled"
  }),
});
// ─── Admin Query Filters ─────────────────────────────────────────────────────

export const orderQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  status: z
    .enum(["Pending", "Shipped", "Delivered", "Cancelled"])
    .optional(),
  storeId: z.string().uuid().optional(),
  customerId: z.string().uuid().optional(),
});

// ─── Store Orders Query ───────────────────────────────────────────────────────

export const storeOrderQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  status: z
    .enum(["Pending", "Shipped", "Delivered", "Cancelled"])
    .optional(),
});

// ─── Types ────────────────────────────────────────────────────────────────────

export type CreateOrderDto = z.infer<typeof createOrderSchema>;
export type UpdateOrderStatusDto = z.infer<typeof updateOrderStatusSchema>;
export type OrderQueryDto = z.infer<typeof orderQuerySchema>;
export type StoreOrderQueryDto = z.infer<typeof storeOrderQuerySchema>;
