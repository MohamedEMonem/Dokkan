import type { Request, Response } from "express";
import { z } from "zod";
import { OrderService } from "../services/OrderService.js";
import { emailService } from "../services/email.service.js";
import {
  createOrderSchema,
  getOrdersQuerySchema,
  updateOrderStatusSchema,
} from "../DTO/order.dto.js";
import {
  sendError,
  sendNotFound,
  sendServerError,
  sendSuccess,
  sendValidationError,
} from "../utils/response.js";

const testOrderItemSchema = z.object({
  name: z.string().trim().min(1).max(150),
  quantity: z.coerce.number().int().min(1),
  unitPrice: z.string().trim().min(1).max(32),
  lineTotal: z.string().trim().max(32).optional(),
});

const testOrderConfirmationSchema = z.object({
  customerName: z.string().trim().min(1).max(100),
  customerEmail: z.string().trim().email(),
  orderNumber: z.string().trim().min(1).max(50),
  totalAmount: z.string().trim().min(1).max(32),
  orderDate: z.string().trim().max(50).optional(),
  storeName: z.string().trim().max(100).optional(),
  items: z.array(testOrderItemSchema).min(1),
});

export const createOrder = async (req: Request, res: Response) => {
  try {
    const validation = createOrderSchema.safeParse(req.body);

    if (!validation.success) {
      return sendValidationError(res, validation.error.format());
    }

    const { storeId, shippingAddress } = validation.data;
    const order = await OrderService.createOrder(
      req.user!.id,
      storeId,
      shippingAddress,
    );

    return sendSuccess(res, order, "Order placed successfully", 201);
  } catch (error) {
    const cause = error as Error & { statusCode?: number };

    if (cause.statusCode) {
      return sendError(res, cause.message, cause.statusCode);
    }

    return sendServerError(res, "Failed to place order", error);
  }
};

export const getOrders = async (req: Request, res: Response) => {
  try {
    const validation = getOrdersQuerySchema.safeParse(req.query);

    if (!validation.success) {
      return sendValidationError(res, validation.error.format());
    }

    const result = await OrderService.getOrders(validation.data);

    return sendSuccess(
      res,
      {
        orders: result.orders,
        meta: {
          page: result.page,
          limit: result.limit,
          total: result.total,
          totalPages: result.totalPages,
        },
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: result.totalPages,
      },
      "Orders retrieved successfully",
    );
  } catch (error) {
    return sendServerError(res, "Failed to retrieve orders", error);
  }
};

export const getMyOrders = async (req: Request, res: Response) => {
  try {
    const validation = getOrdersQuerySchema.safeParse(req.query);

    if (!validation.success) {
      return sendValidationError(res, validation.error.format());
    }

    const { page, limit, status, sortBy, sortDir } = validation.data;
    const result = await OrderService.getOrdersByCustomerId(req.user!.id, {
      skip: (page - 1) * limit,
      take: limit,
      status,
      sortBy,
      sortDir,
    });

    return sendSuccess(
      res,
      {
        orders: result.orders,
        meta: {
          page,
          limit,
          total: result.total,
          totalPages: Math.ceil(result.total / limit),
        },
        page,
        limit,
        total: result.total,
        totalPages: Math.ceil(result.total / limit),
      },
      "Orders retrieved successfully",
    );
  } catch (error) {
    return sendServerError(res, "Failed to retrieve orders", error);
  }
};

export const getOrderById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id?: string };

    if (!id) {
      return sendError(res, "Order id is required", 400);
    }

    const order = await OrderService.getOrderById(id, req.user!.id, req.user!.role!);

    if (!order) {
      return sendNotFound(res, "Order not found");
    }

    return sendSuccess(res, { order }, "Order retrieved successfully");
  } catch (error) {
    return sendServerError(res, "Failed to retrieve order", error);
  }
};

export const getOrdersByStoreId = async (req: Request, res: Response) => {
  try {
    const { storeId } = req.params as { storeId?: string };

    if (!storeId) {
      return sendError(res, "storeId is required", 400);
    }

    const validation = getOrdersQuerySchema.safeParse(req.query);

    if (!validation.success) {
      return sendValidationError(res, validation.error.format());
    }

    const result = await OrderService.getOrdersByStoreId(
      storeId,
      req.user!.id,
      req.user!.role!,
      validation.data,
    );

    const totalPages = Math.ceil(result.total / validation.data.limit);

    return sendSuccess(
      res,
      {
        orders: result.orders,
        meta: {
          page: validation.data.page,
          limit: validation.data.limit,
          total: result.total,
          totalPages,
        },
        page: validation.data.page,
        limit: validation.data.limit,
        total: result.total,
        totalPages,
      },
      "Store orders retrieved successfully",
    );
  } catch (error) {
    const cause = error as Error & { statusCode?: number };

    if (cause.statusCode) {
      return sendError(res, cause.message, cause.statusCode);
    }

    return sendServerError(res, "Failed to retrieve store orders", error);
  }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id?: string };

    if (!id) {
      return sendError(res, "Order id is required", 400);
    }

    const validation = updateOrderStatusSchema.safeParse(req.body);

    if (!validation.success) {
      return sendValidationError(res, validation.error.format());
    }

    const updated = await OrderService.updateOrderStatus(
      id,
      validation.data.status,
      req.user!.id,
      req.user!.role!,
    );

    if (!updated) {
      return sendNotFound(res, "Order not found or access denied");
    }

    return sendSuccess(res, { order: updated }, "Order status updated successfully");
  } catch (error) {
    const cause = error as Error & { statusCode?: number };

    if (cause.statusCode) {
      return sendError(res, cause.message, cause.statusCode);
    }

    return sendServerError(res, "Failed to update order status", error);
  }
};

export const sendOrderConfirmationTestEmail = async (
  req: Request,
  res: Response,
) => {
  try {
    const validation = testOrderConfirmationSchema.safeParse(req.body);

    if (!validation.success) {
      return sendError(
        res,
        "Invalid order confirmation payload",
        400,
        validation.error.flatten(),
      );
    }

    const sent = await emailService.sendOrderConfirmationEmail(validation.data);

    if (!sent) {
      return sendError(res, "Failed to send order confirmation email", 502);
    }

    return sendSuccess(
      res,
      {
        to: validation.data.customerEmail,
        orderNumber: validation.data.orderNumber,
      },
      "Order confirmation email sent successfully",
      200,
    );
  } catch (error) {
    return sendServerError(
      res,
      "Failed to send order confirmation email",
      error,
    );
  }
};