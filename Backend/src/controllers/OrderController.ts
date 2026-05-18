import type { Request, Response } from "express";
import { OrderService } from "../services/OrderService.js";
import { sendSuccess, sendError, sendServerError } from "../utils/response.js";

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