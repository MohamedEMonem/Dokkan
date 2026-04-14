import * as CartService from "../services/CartService.js";
import { sendSuccess, sendError, sendServerError, sendNotFound, sendValidationError } from "../utils/response.js";
import { z } from "zod";

//  Zod Schemas

const addItemSchema = z.object({
    productId: z.string().uuid("productId must be a valid UUID"),
    quantity: z.coerce.number().int().min(1, "quantity must be at least 1").default(1),
});

const updateItemSchema = z.object({
    quantity: z.coerce.number().int().min(0, "quantity must be 0 or more"),
});

// GET /api/cart 
const getCart = async (req, res) => {
    try {
        const cart = await CartService.getCart(req.user.id);
        return sendSuccess(res, cart, "Cart retrieved successfully");
    } catch (error) {
        return sendServerError(res, "Failed to retrieve cart", error);
    }
};


// POST /api/cart/items


//   Add a product to the cart or increment its quantity if it already exists.
//   Body: { productId: UUID, quantity?: number (default 1) }
 
const addItem = async (req, res) => {
    try {
        const validation = addItemSchema.safeParse(req.body);
        if (!validation.success) {
            return sendValidationError(res, validation.error.format());
        }

        const { productId, quantity } = validation.data;

        const newQty = await CartService.addToCart(req.user.id, productId, quantity);

        return sendSuccess(
            res,
            { productId, quantity: newQty },
            "Item added to cart",
            201
        );
    } catch (error) {
        if (error.message === "PRODUCT_NOT_FOUND") {
            return sendNotFound(res, "Product not found or no longer available");
        }
        if (error.message === "OUT_OF_STOCK") {
            return sendError(res, "Product is out of stock", 409);
        }
        return sendServerError(res, "Failed to add item to cart", error);
    }
};

//  PATCH /api/cart/items/:productId


//   Set an item's quantity in the cart. If the item doesn't exist, it will be added with the specified quantity.
//   Sending quantity=0 removes the item.
//   Body: { quantity: number }
 
const updateItem = async (req, res) => {
    try {
        const { productId } = req.params;

        if (!productId) {
            return sendError(res, "productId is required", 400);
        }

        const validation = updateItemSchema.safeParse(req.body);
        if (!validation.success) {
            return sendValidationError(res, validation.error.format());
        }

        const { quantity } = validation.data;

        await CartService.updateCartItem(req.user.id, productId, quantity);

        const message = quantity === 0 ? "Item removed from cart" : "Cart item updated";
        return sendSuccess(res, { productId, quantity }, message);
    } catch (error) {
        return sendServerError(res, "Failed to update cart item", error);
    }
};

//  DELETE /api/cart/items/:productId


//   Remove a specific item from the cart.
 
const removeItem = async (req, res) => {
    try {
        const { productId } = req.params;

        if (!productId) {
            return sendError(res, "productId is required", 400);
        }

        const deleted = await CartService.removeFromCart(req.user.id, productId);

        if (!deleted) {
            return sendNotFound(res, "Item not found in cart");
        }

        return sendSuccess(res, null, "Item removed from cart");
    } catch (error) {
        return sendServerError(res, "Failed to remove item from cart", error);
    }
};

// DELETE /api/cart


//  Clear the entire cart (e.g. called after successful checkout).
 
const clearCart = async (req, res) => {
    try {
        await CartService.clearCart(req.user.id);
        return sendSuccess(res, null, "Cart cleared successfully");
    } catch (error) {
        return sendServerError(res, "Failed to clear cart", error);
    }
};

export {
    getCart,
    addItem,
    updateItem,
    removeItem,
    clearCart,
};
