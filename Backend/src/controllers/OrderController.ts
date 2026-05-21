import type { Request, Response } from "express";
import { z } from "zod";
import { OrderService } from "../services/OrderService.js";
import prisma from "../config/db.js";
import { sendSuccess, sendError, sendServerError } from "../utils/response.js";
import { emailService } from "../services/email.service.js";
import { getOrdersQuerySchema } from "../DTO/order.dto.js";

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
    const { storeId, shippingAddress } = req.body;

    if (!storeId || !shippingAddress) {
      return sendError(res, "storeId and shippingAddress are required", 400);
    }

    const orderId = await OrderService.processCheckout(
      req.user!.id, 
      storeId, 
      shippingAddress
    );

    return sendSuccess(res, { orderId }, "Order placed successfully", 201);
  } catch (error: any) {
    if (error.message === "CART_EMPTY") {
      return sendError(res, "Your cart is empty", 400);
    }
    if (error.message.startsWith("OOS:")) {
      return sendError(res, `Item out of stock: ${error.message.split(":")[1]}`, 409);
    }
    return sendServerError(res, "Failed to create order", error);
  }
};

export const getOrders = async (req: Request, res: Response) => {
  try {
    const parsedQuery = getOrdersQuerySchema.safeParse(req.query);

    if (!parsedQuery.success) {
      return sendError(res, "Invalid query parameters", 400, parsedQuery.error.flatten());
    }

    const { page, limit, status, sortBy, sortDir } = parsedQuery.data;

    const skip = (page - 1) * limit;

    const result = await OrderService.getAllOrders({
      skip,
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
      },
      "Orders fetched",
    );
  } catch (error) {
    return sendServerError(res, "Failed to fetch orders", error);
  }
};

export const getMyOrders = async (req: Request, res: Response) => {
  try {
    const parsedQuery = getOrdersQuerySchema.safeParse(req.query);

    if (!parsedQuery.success) {
      return sendError(res, "Invalid query parameters", 400, parsedQuery.error.flatten());
    }

    const { page, limit, status, sortBy, sortDir } = parsedQuery.data;
    const skip = (page - 1) * limit;

    const result = await OrderService.getOrdersByCustomerId(req.user!.id, {
      skip,
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
      },
      "Orders fetched",
    );
  } catch (error) {
    return sendServerError(res, "Failed to fetch orders", error);
  }
};

export const getOrderById = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const order = await OrderService.getOrderById(id as string);
    if (!order) return sendError(res, "Order not found", 404);

    // Allow admin or the owning customer
    if (req.user!.role !== "Admin" && req.user!.id !== order.customerId) {
      return sendError(res, "Access denied", 403);
    }

    return sendSuccess(res, { order }, "Order fetched");
  } catch (error) {
    return sendServerError(res, "Failed to fetch order", error);
  }
};

export const getOrdersByStoreId = async (req: Request, res: Response) => {
  try {
    const storeId = String(req.params.storeId);
    const parsedQuery = getOrdersQuerySchema.safeParse(req.query);

    if (!parsedQuery.success) {
      return sendError(res, "Invalid query parameters", 400, parsedQuery.error.flatten());
    }

    const { page, limit, status, sortBy, sortDir } = parsedQuery.data;

    const skip = (page - 1) * limit;

    // If not admin, ensure the requester owns the store
    if (req.user!.role !== "Admin") {
      const store = await prisma.store.findUnique({ where: { id: storeId } });
      if (!store) return sendError(res, "Store not found", 404);
      if (store.ownerId !== req.user!.id) return sendError(res, "Access denied", 403);
    }

    const result = await OrderService.getOrdersByStoreId(storeId as string, {
      skip,
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
      },
      "Store orders fetched",
    );
  } catch (error) {
    return sendServerError(res, "Failed to fetch store orders", error);
  }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const status = String(req.body.status || "");

    if (!status) return sendError(res, "status is required", 400);

    // Basic enum validation
    const allowed = ["Pending", "Shipped", "Delivered", "Cancelled"];
    if (!allowed.includes(status)) return sendError(res, "Invalid status", 400);

    const order = await OrderService.getOrderById(id as string);
    if (!order) return sendError(res, "Order not found", 404);

    // Permission: admin or store owner of the order
    if (req.user!.role !== "Admin") {
      // store owner must be owner of the order's store
      if (order.store?.ownerId && req.user!.id !== order.store.ownerId) {
        return sendError(res, "Access denied", 403);
      }
    }

    const updated = await OrderService.updateOrderStatus(id as string, status as string);

    return sendSuccess(res, { order: updated }, "Order status updated");
  } catch (error: any) {
    if (error.code === "P2025") return sendError(res, "Order not found", 404);
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
      return sendError(res, "Invalid order confirmation payload", 400, validation.error.flatten());
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