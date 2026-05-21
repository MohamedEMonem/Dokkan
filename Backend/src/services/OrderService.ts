import { OrderStatus, Prisma } from "@prisma/client";
import prisma from "../config/db.js";
import redisClient from "../utils/redisClient.js";
import type { OrderQueryDto, StoreOrderQueryDto } from "../DTO/order.dto.js";


const CART_KEY = (userId: string) => `cart:${userId}`;
const SHIPPING_COST = 5.0;
const TAX_RATE = 0.08;


// Convert Prisma Decimal fields to plain numbers for safe JSON serialisation.
const serializeOrder = (order: Record<string, unknown>) => {
  const o = { ...order } as Record<string, unknown>;
  if (o.totalAmount !== undefined) o.totalAmount = Number(o.totalAmount);
  if (o.shippingCost !== undefined) o.shippingCost = Number(o.shippingCost);
  if (o.taxAmount !== undefined) o.taxAmount = Number(o.taxAmount);

  if (Array.isArray(o.orderItems)) {
    o.orderItems = (
      o.orderItems as Array<Record<string, unknown>>
    ).map((item: any) => ({
      ...item,
      priceAtPurchase: Number(item.priceAtPurchase),
    }));
  }
  return o;
};

const httpError = (message: string, statusCode: number): never => {
  const err = new Error(message) as Error & { statusCode: number };
  err.statusCode = statusCode;
  throw err;
};

//  Create Order (Checkout) 

/**
 * Places an order from the customer's Redis cart for a single store.
 *
 * Transaction steps:
 *   A – Verify the store is active and all cart items are in stock.
 *   B – Create the Order + OrderItems in the DB.
 *   C – Decrement stock for each ordered product.
 * After transaction:
 *   D – Delete the Redis cart key.
 */
export const createOrder = async (
  userId: string,
  storeId: string,
  shippingAddress: Record<string, unknown>
) => {
  //  Fetch cart from Redis 
  const rawCart = await redisClient.hGetAll(CART_KEY(userId));

  if (!rawCart || Object.keys(rawCart).length === 0) {
    httpError("Cart is empty", 400);
  }

  const cartProductIds = Object.keys(rawCart);

  //  Prisma interactive transaction 
  const order = await prisma.$transaction(async (tx) => {
    //  Guard: store must exist and be active 
    const store = await tx.store.findFirst({
      where: { id: storeId, status: "Active", deletedAt: null },
      select: { id: true, name: true },
    });
    if (!store) {
      httpError("Store not found or is currently unavailable", 404);
    }

    //  Step A: Fetch products belonging to this store from the cart
    const products = await tx.product.findMany({
      where: {
        id: { in: cartProductIds },
        storeId,
        status: "Active",
        deletedAt: null,
      },
      select: {
        id: true,
        title: true,
        price: true,
        stockQuantity: true,
      },
    });

    if (products.length === 0) {
      httpError("No valid items from this store found in your cart", 400);
    }

    const productMap = new Map(products.map((p: any) => [p.id, p]));

    // Build line-items & verify stock
    const lineItems: Array<{
      productId: string;
      quantity: number;
      priceAtPurchase: number;
    }> = [];

    for (const [productId, qtyStr] of Object.entries(rawCart)) {
      const product = productMap.get(productId);
      if (!product) continue; // item belongs to a different store — skip

      const quantity = parseInt(qtyStr, 10);

      if (product.stockQuantity < quantity) {
        httpError(
          `Insufficient stock for "${product.title}". ` +
            `Available: ${product.stockQuantity}, Requested: ${quantity}`,
          409
        );
      }

      lineItems.push({
        productId,
        quantity,
        priceAtPurchase: Number(product.price),
      });
    }

    if (lineItems.length === 0) {
      httpError("No valid items from this store found in your cart", 400);
    }

    // Calculate totals
    const subtotal = lineItems.reduce(
      (sum, item) => sum + item.priceAtPurchase * item.quantity,
      0
    );
    const taxAmount = parseFloat((subtotal * TAX_RATE).toFixed(2));
    const totalAmount = parseFloat(
      (subtotal + SHIPPING_COST + taxAmount).toFixed(2)
    );

    // Step B: Create Order + OrderItems
    const newOrder = await tx.order.create({
      data: {
        customerId: userId,
        storeId,
        shippingAddress: shippingAddress as Prisma.InputJsonValue,
        status: "Pending",
        paymentStatus: "Pending",
        shippingCost: SHIPPING_COST,
        taxAmount,
        totalAmount,
        orderItems: {
          create: lineItems,
        },
      },
      include: {
        orderItems: {
          include: {
            product: {
              select: {
                id: true,
                title: true,
                images: { take: 1, select: { imageUrl: true } },
              },
            },
          },
        },
        store: { select: { id: true, name: true} },
      },
    });

    //  Step C: Decrement stock (within the same transaction) 
    await Promise.all(
      lineItems.map((item) =>
        tx.product.update({
          where: { id: item.productId },
          data: { stockQuantity: { decrement: item.quantity } },
        })
      )
    );

    return newOrder;
  });

  //  Step D: Clear the Redis cart (outside DB transaction) 
  await redisClient.del(CART_KEY(userId));

  return serializeOrder(order as unknown as Record<string, unknown>);
};

//  Get All Orders (Admin) 

export const getOrders = async (query: OrderQueryDto) => {
  const { page, limit, status, storeId, customerId } = query;
  const skip = (page - 1) * limit;

  const where = {
    deletedAt: null,
    ...(status && { status }),
    ...(storeId && { storeId }),
    ...(customerId && { customerId }),
  };

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      include: {
        customer: { select: { id: true, name: true, email: true } },
        store: { select: { id: true, name: true, subdomain: true } },
        orderItems: {
          include: {
            product: { select: { id: true, title: true } },
          },
        },
      },
    }),
    prisma.order.count({ where }),
  ]);

  return {
    orders: orders.map((o: any) =>
      serializeOrder(o as unknown as Record<string, unknown>)
    ),
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

//  Get Order By ID (All roles — service enforces access) 

export const getOrderById = async (
  orderId: string,
  userId: string,
  role: string
) => {
  const order = await prisma.order.findFirst({
    where: { id: orderId, deletedAt: null },
    include: {
      customer: { select: { id: true, name: true, email: true } },
      store: { select: { id: true, name: true, subdomain: true } },
      orderItems: {
        include: {
          product: {
            select: {
              id: true,
              title: true,
              images: { take: 1, select: { imageUrl: true } },
            },
          },
        },
      },
    },
  });

  if (!order) return null;

  //  Access control 
  if (role === "Admin") {
    return serializeOrder(order as unknown as Record<string, unknown>);
  }

  if (role === "Customer" && order.customerId === userId) {
    return serializeOrder(order as unknown as Record<string, unknown>);
  }

  if (role === "StoreOwner") {
    const ownedStore = await prisma.store.findFirst({
      where: { id: order.storeId, ownerId: userId },
      select: { id: true },
    });
    if (ownedStore) {
      return serializeOrder(order as unknown as Record<string, unknown>);
    }
  }

  return null; // caller maps this to 404
};

//  Get Orders By Store ID (StoreOwner + Admin) 

export const getOrdersByStoreId = async (
  storeId: string,
  userId: string,
  role: string,
  query: StoreOrderQueryDto
) => {
  const { page, limit, status } = query;

  //  Access control 
  if (role === "StoreOwner") {
    const ownedStore = await prisma.store.findFirst({
      where: { id: storeId, ownerId: userId },
      select: { id: true },
    });
    if (!ownedStore) {
      httpError("Store not found or access denied", 403);
    }
  } else if (role !== "Admin") {
    httpError("Access denied", 403);
  }

  //  Verify the store actually exists 
  const store = await prisma.store.findFirst({
    where: { id: storeId, deletedAt: null },
    select: { id: true, name: true },
  });
  if (!store) httpError("Store not found", 404);

  const skip = (page - 1) * limit;
  const where = {
    storeId,
    deletedAt: null,
    ...(status && { status }),
  };

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      include: {
        customer: { select: { id: true, name: true, email: true } },
        orderItems: {
          include: {
            product: { select: { id: true, title: true } },
          },
        },
      },
    }),
    prisma.order.count({ where }),
  ]);

  return {
    orders: orders.map((o) =>
      serializeOrder(o as unknown as Record<string, unknown>)
    ),
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

//  Update Order Status (StoreOwner + Admin) 

/**
 * Allowed status transitions:
 *   Pending  → Shipped | Cancelled
 *   Shipped  → Delivered | Cancelled
 *   Delivered / Cancelled → immutable
 *
 * When a Pending order is cancelled, product stock is restored in the
 * same transaction.
 */
export const updateOrderStatus = async (
  orderId: string,
  newStatus: string,
  userId: string,
  role: string
) => {
  const order = await prisma.order.findFirst({
    where: { id: orderId, deletedAt: null },
    include: {
      orderItems: { select: { productId: true, quantity: true } },
    },
  });

  if (!order) return null;

  //  Access control 
  if (role === "StoreOwner") {
    const ownedStore = await prisma.store.findFirst({
      where: { id: order.storeId, ownerId: userId },
      select: { id: true },
    });
    if (!ownedStore) return null; // treated as 404 by caller
  } else if (role !== "Admin") {
    return null;
  }

  //  Guard: terminal states cannot be updated 
  if (
    order.status === OrderStatus.Delivered ||
    order.status === OrderStatus.Cancelled
  ) {
    httpError(
      `Cannot update a ${order.status.toLowerCase()} order`,
      409
    );
  }

  //  Valid transition check 
  const validTransitions: Record<string, string[]> = {
    Pending: ["Shipped", "Cancelled"],
    Shipped: ["Delivered", "Cancelled"],
  };

  if (!validTransitions[order.status]?.includes(newStatus)) {
    httpError(
      `Cannot transition from ${order.status} to ${newStatus}`,
      409
    );
  }

  //  Run update (+ optional stock restoration) in a transaction 
  const updated = await prisma.$transaction(async (tx) => {
    const updatedOrder = await tx.order.update({
      where: { id: orderId },
      data: { status: newStatus as OrderStatus },
      include: {
        customer: { select: { id: true, name: true, email: true } },
        store: { select: { id: true, name: true, subdomain: true } },
        orderItems: {
          include: {
            product: { select: { id: true, title: true } },
          },
        },
      },
    });

    // Restore stock when a Pending order is cancelled
    if (newStatus === "Cancelled" && order.status === OrderStatus.Pending) {
      await Promise.all(
        order.orderItems.map((item: any) =>
          tx.product.update({
            where: { id: item.productId },
            data: { stockQuantity: { increment: item.quantity } },
          })
        )
      );
    }

    return updatedOrder;
  });

  return serializeOrder(updated as unknown as Record<string, unknown>);
};
