import type { Request, Response, NextFunction } from "express";
import * as CartService from "../services/CartService.js";
import {
  sendError,
  sendNotFound,
  sendServerError,
  sendSuccess,
  sendValidationError,
} from "../utils/response.js";
import { z } from "zod";

const addItemSchema = z.object({
  productId: z.string().uuid("productId must be a valid UUID"),
  quantity: z.coerce.number().int().min(1, "quantity must be at least 1").default(1),
});

const updateItemSchema = z.object({
  quantity: z.coerce.number().int().min(0, "quantity must be 0 or more"),
});

export const getCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cart = await CartService.getCart(req.user!.id);
    return sendSuccess(res, cart, "Cart retrieved successfully");
  } catch (error) {
    return next(error);
  }
};

export const addItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validation = addItemSchema.safeParse(req.body);
    if (!validation.success) {
      return sendValidationError(res, validation.error.format());
    }

    const { productId, quantity } = validation.data;
    const newQty = await CartService.addToCart(req.user!.id, productId, quantity);

    return sendSuccess(res, { productId, quantity: newQty }, "Item added to cart", 201);
  } catch (error) {
    const cause = error as Error;
    if (cause.message === "PRODUCT_NOT_FOUND") {
      const err: any = new Error("Product not found or no longer available");
      err.status = 404;
      return next(err);
    }
    if (cause.message === "OUT_OF_STOCK") {
      const err: any = new Error("Product is out of stock");
      err.status = 409;
      return next(err);
    }
    return next(error);
  }
};

export const updateItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { productId } = req.params as { productId?: string };

    if (!productId) {
      return sendError(res, "productId is required", 400);
    }

    const validation = updateItemSchema.safeParse(req.body);
    if (!validation.success) {
      return sendValidationError(res, validation.error.format());
    }

    const { quantity } = validation.data;

    await CartService.updateCartItem(req.user!.id, productId, quantity);

    const message = quantity === 0 ? "Item removed from cart" : "Cart item updated";
    return sendSuccess(res, { productId, quantity }, message);
  } catch (error) {
    return next(error);
  }
};

export const removeItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { productId } = req.params as { productId?: string };

    if (!productId) {
      return sendError(res, "productId is required", 400);
    }

    const deleted = await CartService.removeFromCart(req.user!.id, productId);

    if (!deleted) {
      return sendNotFound(res, "Item not found in cart");
    }

    return sendSuccess(res, null, "Item removed from cart");
  } catch (error) {
    return next(error);
  }
};

export const clearCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await CartService.clearCart(req.user!.id);
    return sendSuccess(res, null, "Cart cleared successfully");
  } catch (error) {
    return next(error);
  }
};