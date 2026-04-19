import redisClient from "../utils/redisClient.js";
import prisma from "../config/db.js";

// Flat shipping estimate in currency units (e.g. $5.00)
const SHIPPING_ESTIMATE = 5.0;


//   Returns the Redis hash key for a user's cart.
//   Structure: cart:{userId} → { [productId]: quantity, ... }
 
const cartKey = (userId) => `cart:${userId}`;


const addToCart = async (userId, productId, quantity = 1) => {
    if (!userId || !productId) throw new Error("userId and productId are required");
    if (!Number.isInteger(quantity) || quantity < 1) throw new Error("quantity must be a positive integer");

    // Verify the product exists and is not soft-deleted
    const product = await prisma.product.findUnique({
        where: { id: productId },
        select: { id: true, title: true, stockQuantity: true, deletedAt: true },
    });

    if (!product || product.deletedAt) {
        throw new Error("PRODUCT_NOT_FOUND");
    }

    if (product.stockQuantity < 1) {
        throw new Error("OUT_OF_STOCK");
    }

    const newQty = await redisClient.hIncrBy(cartKey(userId), productId, quantity);
    return newQty;
};


const removeFromCart = async (userId, productId) => {
    if (!userId || !productId) throw new Error("userId and productId are required");
    const deleted = await redisClient.hDel(cartKey(userId), productId);
    return deleted;
};


const updateCartItem = async (userId, productId, quantity) => {
    if (!userId || !productId) throw new Error("userId and productId are required");
    if (!Number.isInteger(quantity)) throw new Error("quantity must be an integer");

    if (quantity <= 0) {
        return removeFromCart(userId, productId);
    }

    await redisClient.hSet(cartKey(userId), productId, String(quantity));
    return quantity;
};


const getCart = async (userId) => {
    if (!userId) throw new Error("userId is required");

    // Get all { productId: quantityString } from Redis
    const rawHash = await redisClient.hGetAll(cartKey(userId));

    if (!rawHash || Object.keys(rawHash).length === 0) {
        return {
            items: [],
            itemsTotal: 0,
            shippingEstimate: 0,
            grandTotal: 0,
        };
    }

    const productIds = Object.keys(rawHash);

    // Fetch current product details from Postgres (live prices)
    const products = await prisma.product.findMany({
        where: {
            id: { in: productIds },
            deletedAt: null,
        },
        select: {
            id: true,
            title: true,
            price: true,
            stockQuantity: true,
            images: {
                take: 1,
                select: { imageUrl: true },
            },
        },
    });

    // Index by id for O(1) lookup
    const productMap = Object.fromEntries(products.map((p) => [p.id, p]));

    // Build line items — skip any product that was deleted since being added
    const items = [];
    let itemsTotal = 0;

    for (const [productId, qtyStr] of Object.entries(rawHash)) {
        const product = productMap[productId];
        if (!product) {
            // Product was deleted; clean up the stale Redis entry silently
            await redisClient.hDel(cartKey(userId), productId);
            continue;
        }

        const quantity = parseInt(qtyStr, 10);
        const unitPrice = parseFloat(product.price); // Prisma Decimal → float
        const lineTotal = parseFloat((unitPrice * quantity).toFixed(2));

        items.push({
            productId,
            title: product.title,
            imageUrl: product.images[0]?.imageUrl ?? null,
            unitPrice,
            quantity,
            lineTotal,
            inStock: product.stockQuantity > 0,
        });

        itemsTotal += lineTotal;
    }

    itemsTotal = parseFloat(itemsTotal.toFixed(2));
    const shippingEstimate = items.length > 0 ? SHIPPING_ESTIMATE : 0;
    const grandTotal = parseFloat((itemsTotal + shippingEstimate).toFixed(2));

    return { items, itemsTotal, shippingEstimate, grandTotal };
};


const clearCart = async (userId) => {
    if (!userId) throw new Error("userId is required");
    await redisClient.del(cartKey(userId));
};

export {
    addToCart,
    removeFromCart,
    updateCartItem,
    getCart,
    clearCart,
};
