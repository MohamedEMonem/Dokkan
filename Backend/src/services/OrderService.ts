import { OrderStatus, Prisma } from "@prisma/client";
import prisma from "../config/db.js";
import redisClient from "../utils/redisClient.js";
import type { OrderQueryDto, StoreOrderQueryDto } from "../DTO/order.dto.js";
import { emailService } from "./email.service.js";

const CART_KEY = (userId: string) => `cart:${userId}`;
const SHIPPING_COST = 5.0;
const TAX_RATE = 0.14;

type OrderStatusValue = "Pending" | "Shipped" | "Delivered" | "Cancelled";
type OrderSortBy = "createdAt" | "status" | "totalAmount";
type OrderSortDir = "asc" | "desc";

type OrderListOptions = {
  skip: number;
  take: number;
  status?: OrderStatusValue;
  sortBy?: OrderSortBy;
  sortDir?: OrderSortDir;
};

const serializeOrder = (order: Record<string, unknown>) => {
  const serializedOrder = { ...order } as Record<string, unknown>;

  if (serializedOrder.totalAmount !== undefined) {
    serializedOrder.totalAmount = Number(serializedOrder.totalAmount);
  }
  if (serializedOrder.shippingCost !== undefined) {
    serializedOrder.shippingCost = Number(serializedOrder.shippingCost);
  }
  if (serializedOrder.taxAmount !== undefined) {
    serializedOrder.taxAmount = Number(serializedOrder.taxAmount);
  }

  if (Array.isArray(serializedOrder.orderItems)) {
    serializedOrder.orderItems = (
      serializedOrder.orderItems as Array<Record<string, unknown>>
    ).map((item) => ({
      ...item,
      priceAtPurchase: Number(item.priceAtPurchase),
    }));
  }

  return serializedOrder;
};

const httpError = (message: string, statusCode: number): never => {
  const error = new Error(message) as Error & { statusCode: number };
  error.statusCode = statusCode;
  throw error;
};

const toOrderBy = (sortBy: OrderSortBy, sortDir: OrderSortDir) =>
  ({ [sortBy]: sortDir } as Prisma.OrderOrderByWithRelationInput);

export class OrderService {
  static async createOrder(
    userId: string,
    shippingAddress: Record<string, unknown>,
    username: string,
    phoneNumber: string,
    email: string,
  ) {
    const rawCart = await redisClient.hGetAll(CART_KEY(userId));

    if (!rawCart || Object.keys(rawCart).length === 0) {
      httpError("Cart is empty", 400);
    }

    const cartProductIds = Object.keys(rawCart);

    const orders = await prisma.$transaction(async (tx) => {
      // Fetch all cart products with their storeId (no store filter)
      const products = await tx.product.findMany({
        where: {
          id: { in: cartProductIds },
          status: "Active",
          deletedAt: null,
        },
        select: {
          id: true,
          title: true,
          price: true,
          stockQuantity: true,
          storeId: true,
        },
      });

      if (products.length === 0) {
        httpError("No valid items found in your cart", 400);
      }

      // Group products by storeId
      const storeGroups = new Map<
        string,
        Array<{ productId: string; quantity: number; priceAtPurchase: number }>
      >();

      const productMap = new Map(products.map((p) => [p.id, p]));

      for (const [productId, qtyStr] of Object.entries(rawCart)) {
        const product = productMap.get(productId);
        if (!product) continue;

        const quantity = parseInt(qtyStr, 10);

        if (product.stockQuantity < quantity) {
          httpError(
            `Insufficient stock for "${product.title}". Available: ${product.stockQuantity}, Requested: ${quantity}`,
            409,
          );
        }

        if (!storeGroups.has(product.storeId)) {
          storeGroups.set(product.storeId, []);
        }

        storeGroups.get(product.storeId)!.push({
          productId,
          quantity,
          priceAtPurchase: Number(product.price),
        });
      }

      if (storeGroups.size === 0) {
        httpError("No valid items found in your cart", 400);
      }

      // Validate all stores are active
      const storeIds = Array.from(storeGroups.keys());
      const stores = await tx.store.findMany({
        where: { id: { in: storeIds }, status: "Active", deletedAt: null },
        select: { id: true, name: true },
      });

      const activeStoreIds = new Set(stores.map((s) => s.id));
      for (const sid of storeIds) {
        if (!activeStoreIds.has(sid)) {
          httpError("One or more stores are unavailable", 404);
        }
      }

      // Create one order per store
      const createdOrders = [];

      for (const [storeId, lineItems] of storeGroups) {
        const subtotal = lineItems.reduce(
          (sum, item) => sum + item.priceAtPurchase * item.quantity,
          0,
        );
        const taxAmount = parseFloat((subtotal * TAX_RATE).toFixed(2));
        const totalAmount = parseFloat(
          (subtotal + SHIPPING_COST + taxAmount).toFixed(2),
        );

        const newOrder = await tx.order.create({
          data: {
            customerId: userId,
            storeId,
            shippingAddress: {
              ...shippingAddress,
              username,
              phoneNumber,
              email,
            } as Prisma.InputJsonValue,
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
            store: { select: { id: true, name: true } },
          },
        });

        // Decrement stock for this store's items
        for (const item of lineItems) {
          const updateResult = await tx.product.updateMany({
            where: { id: item.productId, stockQuantity: { gte: item.quantity } },
            data: { stockQuantity: { decrement: item.quantity } },
          });

          if (updateResult.count === 0) {
            const err = new Error(`Product is out of stock`) as Error & { statusCode?: number };
            err.statusCode = 409;
            throw err;
          }
        }

        createdOrders.push(newOrder);
      }

      return createdOrders;
    });

    await redisClient.del(CART_KEY(userId));

    // Send confirmation emails asynchronously
    Promise.all(orders.map(async (order) => {
      try {
        await emailService.sendOrderConfirmationEmail({
          customerName: username,
          customerEmail: email,
          orderNumber: order.id,
          totalAmount: String(order.totalAmount),
          orderDate: order.createdAt?.toISOString(),
          storeName: order.store.name,
          items: order.orderItems.map((item: any) => ({
            name: item.product.title,
            quantity: item.quantity,
            unitPrice: String(item.priceAtPurchase),
          })),
        });
      } catch (err) {
        console.error("Failed to send order confirmation email:", err);
      }
    })).catch((err) => console.error("Unhandled promise in email sending:", err));

    return orders.map((order) =>
      serializeOrder(order as unknown as Record<string, unknown>),
    );
  }

  static async getOrders(query: OrderQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;

    const where: Prisma.OrderWhereInput = {
      deletedAt: null,
      ...(query.status ? { status: query.status } : {}),
      ...(query.storeId ? { storeId: query.storeId } : {}),
      ...(query.customerId ? { customerId: query.customerId } : {}),
    };

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        orderBy: toOrderBy(query.sortBy ?? "createdAt", query.sortDir ?? "desc"),
        skip,
        take: limit,
        include: {
          customer: { select: { id: true, name: true, email: true } },
          store: { select: { id: true, name: true, subdomain: true, ownerId: true } },
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
      orders: orders.map((order) =>
        serializeOrder(order as unknown as Record<string, unknown>),
      ),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  static async getOrdersByCustomerId(customerId: string, options: OrderListOptions) {
    return this.listOrders(
      {
        customerId,
        ...(options.status ? { status: options.status } : {}),
      },
      options,
      {
        customer: { select: { id: true, name: true, email: true } },
        store: { select: { id: true, name: true, subdomain: true, ownerId: true } },
        orderItems: {
          include: {
            product: { select: { id: true, title: true } },
          },
        },
      },
    );
  }

  static async getOrderById(orderId: string, userId: string, role: string) {
    const order = await prisma.order.findFirst({
      where: { id: orderId, deletedAt: null },
      include: {
        customer: { select: { id: true, name: true, email: true } },
        store: { select: { id: true, name: true, subdomain: true, ownerId: true } },
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
        productReviews: true,
      },
    });

    if (!order) {
      return null;
    }

    if (role === "Admin") {
      return serializeOrder(order as unknown as Record<string, unknown>);
    }

    if (role === "Customer" && order.customerId === userId) {
      return serializeOrder(order as unknown as Record<string, unknown>);
    }

    if (role === "StoreOwner" && order.store.ownerId === userId) {
      return serializeOrder(order as unknown as Record<string, unknown>);
    }

    return null;
  }

  static async getOrdersByStoreId(
    storeId: string,
    userId: string,
    role: string,
    query: StoreOrderQueryDto,
  ) {
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

    const store = await prisma.store.findFirst({
      where: { id: storeId, deletedAt: null },
      select: { id: true, name: true },
    });

    if (!store) {
      httpError("Store not found", 404);
    }

    return this.listOrders(
      {
        storeId,
        ...(query.status ? { status: query.status } : {}),
      },
      {
        skip: (query.page - 1) * query.limit,
        take: query.limit,
        status: query.status,
        sortBy: query.sortBy,
        sortDir: query.sortDir,
      },
      {
        customer: { select: { id: true, name: true, email: true } },
        orderItems: {
          include: {
            product: { select: { id: true, title: true } },
          },
        },
      },
    );
  }

  static async updateOrderStatus(
    orderId: string,
    newStatus: string,
    userId: string,
    role: string,
  ) {
    const order = await prisma.order.findFirst({
      where: { id: orderId, deletedAt: null },
      include: {
        store: { select: { id: true, ownerId: true } },
        orderItems: { select: { productId: true, quantity: true } },
      },
    });

    if (!order) {
      return null;
    }

    if (role === "StoreOwner" && order.store.ownerId !== userId) {
      return null;
    }

    if (role !== "Admin" && role !== "StoreOwner") {
      return null;
    }

    if (
      order.status === OrderStatus.Delivered ||
      order.status === OrderStatus.Cancelled
    ) {
      httpError(`Cannot update a ${order.status.toLowerCase()} order`, 409);
    }

    const validTransitions: Record<OrderStatusValue, OrderStatusValue[]> = {
      Pending: ["Shipped", "Cancelled"],
      Shipped: ["Delivered", "Cancelled"],
      Delivered: [],
      Cancelled: [],
    };

    if (!validTransitions[order.status].includes(newStatus as OrderStatusValue)) {
      httpError(`Cannot transition from ${order.status} to ${newStatus}`, 409);
    }

    const updated = await prisma.$transaction(async (tx) => {
      const updatedOrder = await tx.order.update({
        where: { id: orderId },
        data: { status: newStatus as OrderStatus },
        include: {
          customer: { select: { id: true, name: true, email: true } },
          store: { select: { id: true, name: true, subdomain: true, ownerId: true } },
          orderItems: {
            include: {
              product: { select: { id: true, title: true } },
            },
          },
        },
      });

      if (newStatus === "Cancelled" && (order.status === OrderStatus.Pending || order.status === OrderStatus.Shipped)) {
        await Promise.all(
          order.orderItems.map((item) =>
            tx.product.update({
              where: { id: item.productId },
              data: { stockQuantity: { increment: item.quantity } },
            }),
          ),
        );
      }

      return updatedOrder;
    });

    return serializeOrder(updated as unknown as Record<string, unknown>);
  }

  private static async listOrders(
    where: Prisma.OrderWhereInput,
    options: OrderListOptions,
    include: Prisma.OrderInclude,
  ) {
    const orderBy = toOrderBy(options.sortBy ?? "createdAt", options.sortDir ?? "desc");

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where: {
          deletedAt: null,
          ...where,
        },
        orderBy,
        skip: options.skip,
        take: options.take,
        include,
      }),
      prisma.order.count({
        where: {
          deletedAt: null,
          ...where,
        },
      }),
    ]);

    return {
      orders: orders.map((order) =>
        serializeOrder(order as unknown as Record<string, unknown>),
      ),
      total,
    };
  }
}