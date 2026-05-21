import type { Request, Response } from "express";
import * as OrderService from "../services/OrderService.js";
import {
  sendError,
  sendNotFound,
  sendServerError,
  sendSuccess,
  sendValidationError,
} from "../utils/response.js";
import {
  createOrderSchema,
  orderQuerySchema,
  storeOrderQuerySchema,
  updateOrderStatusSchema,
} from "../DTO/order.dto.js";

//  Checkout / Create Order (Customer)

export const createOrder = async (req: Request, res: Response) => {
  try {
    const validation = createOrderSchema.safeParse(req.body);
    if (!validation.success) {
      return sendValidationError(res, validation.error.format());
    }

    const { storeId, shippingAddress } = validation.data;
    const userId = req.user!.id;

    const order = await OrderService.createOrder(userId, storeId, shippingAddress);
    return sendSuccess(res, order, "Order placed successfully", 201);
  } catch (error) {
    const cause = error as Error & { statusCode?: number };
    if (cause.statusCode) {
      return sendError(res, cause.message, cause.statusCode);
    }
    return sendServerError(res, "Failed to place order", error);
  }
};

// Get All Orders (Admin)

export const getOrders = async (req: Request, res: Response) => {
  try {
    const validation = orderQuerySchema.safeParse(req.query);
    if (!validation.success) {
      return sendValidationError(res, validation.error.format());
    }

    const result = await OrderService.getOrders(validation.data);
    return sendSuccess(res, result, "Orders retrieved successfully");
  } catch (error) {
    return sendServerError(res, "Failed to retrieve orders", error);
  }
};

// Get Order By ID (All roles)

export const getOrderById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id?: string };
    if (!id) return sendError(res, "Order id is required", 400);

    const order = await OrderService.getOrderById(
      id,
      req.user!.id,
      req.user!.role!
    );

    if (!order) return sendNotFound(res, "Order not found");
    return sendSuccess(res, order, "Order retrieved successfully");
  } catch (error) {
    return sendServerError(res, "Failed to retrieve order", error);
  }
};

// Get Orders By Store ID (StoreOwner + Admin)

export const getOrdersByStoreId = async (req: Request, res: Response) => {
  try {
    const { storeId } = req.params as { storeId?: string };
    if (!storeId) return sendError(res, "storeId is required", 400);

    const validation = storeOrderQuerySchema.safeParse(req.query);
    if (!validation.success) {
      return sendValidationError(res, validation.error.format());
    }

    const result = await OrderService.getOrdersByStoreId(
      storeId,
      req.user!.id,
      req.user!.role!,
      validation.data
    );

    return sendSuccess(res, result, "Store orders retrieved successfully");
  } catch (error) {
    const cause = error as Error & { statusCode?: number };
    if (cause.statusCode) {
      return sendError(res, cause.message, cause.statusCode);
    }
    return sendServerError(res, "Failed to retrieve store orders", error);
  }
};

// Update Order Status (StoreOwner + Admin)

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id?: string };
    if (!id) return sendError(res, "Order id is required", 400);

    const validation = updateOrderStatusSchema.safeParse(req.body);
    if (!validation.success) {
      return sendValidationError(res, validation.error.format());
    }

    const updated = await OrderService.updateOrderStatus(
      id,
      validation.data.status,
      req.user!.id,
      req.user!.role!
    );

    if (!updated) return sendNotFound(res, "Order not found or access denied");
    return sendSuccess(res, updated, "Order status updated successfully");
  } catch (error) {
    const cause = error as Error & { statusCode?: number };
    if (cause.statusCode) {
      return sendError(res, cause.message, cause.statusCode);
    }
    return sendServerError(res, "Failed to update order status", error);
  }
};
