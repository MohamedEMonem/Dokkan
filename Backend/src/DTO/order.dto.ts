import { z } from "zod";

export const getOrdersQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(20),
  status: z.enum(["Pending", "Shipped", "Delivered", "Cancelled"]).optional(),
  sortBy: z.enum(["createdAt", "status", "totalAmount"]).optional().default("createdAt"),
  sortDir: z.enum(["asc", "desc"]).optional().default("desc"),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(["Pending", "Shipped", "Delivered", "Cancelled"]),
});

export type GetOrdersQueryDto = z.infer<typeof getOrdersQuerySchema>;
export type UpdateOrderStatusDto = z.infer<typeof updateOrderStatusSchema>;
