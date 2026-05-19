import { z } from "zod";

export const getOrdersQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(20),
  status: z.string().optional(),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(["Pending", "Shipped", "Delivered", "Cancelled"]),
});

export type UpdateOrderStatusDto = z.infer<typeof updateOrderStatusSchema>;
