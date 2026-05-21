import { z } from "zod";

const orderStatusValues = ["Pending", "Shipped", "Delivered", "Cancelled"] as const;
const orderSortByValues = ["createdAt", "status", "totalAmount"] as const;
const orderSortDirValues = ["asc", "desc"] as const;

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

export const getOrdersQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(20),
  status: z.enum(orderStatusValues).optional(),
  sortBy: z.enum(orderSortByValues).optional().default("createdAt"),
  sortDir: z.enum(orderSortDirValues).optional().default("desc"),
});

export const orderQuerySchema = getOrdersQuerySchema.extend({
  storeId: z.string().uuid().optional(),
  customerId: z.string().uuid().optional(),
});

export const storeOrderQuerySchema = getOrdersQuerySchema;

export const updateOrderStatusSchema = z.object({
  status: z.enum(orderStatusValues, {
    message: "status must be one of: Pending, Shipped, Delivered, Cancelled",
  }),
});

export type CreateOrderDto = z.infer<typeof createOrderSchema>;
export type GetOrdersQueryDto = z.infer<typeof getOrdersQuerySchema>;
export type OrderQueryDto = z.infer<typeof orderQuerySchema>;
export type StoreOrderQueryDto = z.infer<typeof storeOrderQuerySchema>;
export type UpdateOrderStatusDto = z.infer<typeof updateOrderStatusSchema>;
