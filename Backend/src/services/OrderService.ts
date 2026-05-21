import { Prisma } from "@prisma/client";
import prisma from "../config/db.js";
import redisClient from "../utils/redisClient.js";
import { getCart } from "./CartService.js";

type TransactionClient = Parameters<Parameters<typeof prisma.$transaction>[0]>[0];

type OrderListOptions = {
  skip: number;
  take: number;
  status?: "Pending" | "Shipped" | "Delivered" | "Cancelled";
  sortBy: "createdAt" | "status" | "totalAmount";
  sortDir: "asc" | "desc";
};

export class OrderService {

  static async processCheckout(userId: string, storeId: string, shippingAddress: any) {
    const cart = await getCart(userId);
    
    if (!cart || cart.items.length === 0) {
      throw new Error("CART_EMPTY");
    }

    const result = await prisma.$transaction(async (tx: TransactionClient) => {
      
      // Verify stock availability AND tenant isolation
      for (const item of cart.items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
          select: { 
            title: true, 
            stockQuantity: true, 
            storeId: true 
          }
        });

        if (!product) {
          throw new Error(`PRODUCT_NOT_FOUND: ${item.productId}`);
        }

        // ISOLATION CHECK
        if (product.storeId !== storeId) {
          throw new Error(`TENANT_MISMATCH: Product '${product.title}' does not belong to this store.`);
        }

        // STOCK CHECK
        if (product.stockQuantity < item.quantity) {
          throw new Error(`OOS: ${product.title}`);
        }
      }

      // Create Order & OrderItems
      const order = await tx.order.create({
        data: {
          customerId: userId,
          storeId: storeId,
          totalAmount: cart.grandTotal,
          shippingCost: cart.shippingEstimate,
          shippingAddress: shippingAddress,
          status: "Pending",
          paymentStatus: "Pending",
          orderItems: {
            create: cart.items.map(item => ({
              productId: item.productId,
              quantity: item.quantity,
              priceAtPurchase: item.unitPrice
            }))
          }
        }
      });

      // Decrement Product Stock
      for (const item of cart.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stockQuantity: { decrement: item.quantity }
          }
        });
      }

      return order;
    });

    // Delete Redis Cart key
    await redisClient.del(`cart:${userId}`);

    return result.id; 
  }

  private static async listOrders(where: Prisma.OrderWhereInput, options: OrderListOptions) {
    const { skip, take, sortBy, sortDir } = options;

    const orderBy = {
      [sortBy]: sortDir,
    } as Prisma.OrderOrderByWithRelationInput;

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where: {
          deletedAt: null,
          ...where,
        },
        orderBy,
        skip,
        take,
        include: {
          customer: { select: { id: true, name: true, email: true } },
          store: { select: { id: true, name: true, ownerId: true } },
        },
      }),
      prisma.order.count({
        where: {
          deletedAt: null,
          ...where,
        },
      }),
    ]);

    return { orders, total };
  }

  static async getAllOrders(options: OrderListOptions) {
    const where: Prisma.OrderWhereInput = options.status
      ? { status: options.status }
      : {};

    return this.listOrders(where, options);
  }

  static async getOrdersByCustomerId(customerId: string, options: OrderListOptions) {
    const where: Prisma.OrderWhereInput = {
      customerId,
      ...(options.status ? { status: options.status } : {}),
    };

    return this.listOrders(where, options);
  }

  static async getOrderById(orderId: string) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        customer: { select: { id: true, name: true, email: true } },
        store: { select: { id: true, name: true, ownerId: true } },
        orderItems: { include: { product: { select: { id: true, title: true, price: true } } } },
        reviews: true,
      },
    });

    return order;
  }

  static async getOrdersByStoreId(storeId: string, options: OrderListOptions) {
    const where: Prisma.OrderWhereInput = {
      storeId,
      ...(options.status ? { status: options.status } : {}),
    };

    return this.listOrders(where, options);
  }

  static async updateOrderStatus(orderId: string, status: string) {
    const updated = await prisma.order.update({
      where: { id: orderId },
      data: { status: status as any },
      include: {
        customer: { select: { id: true, name: true, email: true } },
        store: { select: { id: true, name: true, ownerId: true } },
        orderItems: { include: { product: { select: { id: true, title: true } } } },
      },
    });

    return updated;
  }
}