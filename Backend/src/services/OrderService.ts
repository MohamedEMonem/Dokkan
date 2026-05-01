import prisma from "../config/db.js"; // Your initialized PrismaClient[cite: 20]
import redisClient from "../utils/redisClient.js";
import { getCart } from "./CartService.js";

// This helper extracts the exact type Prisma expects for the 'tx' parameter
type TransactionClient = Parameters<Parameters<typeof prisma.$transaction>[0]>[0];

export class OrderService {
  static async processCheckout(userId: string, storeId: string, shippingAddress: any) {
    const cart = await getCart(userId);
    if (!cart || cart.items.length === 0) {
      throw new Error("CART_EMPTY");
    }

    // Now 'tx' is explicitly and safely typed using the extracted TransactionClient
    const result = await prisma.$transaction(async (tx: TransactionClient) => {
      
      // Step A: Verify stock availability[cite: 29]
      for (const item of cart.items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
          select: { title: true, stockQuantity: true }
        });

        if (!product || product.stockQuantity < item.quantity) {
          throw new Error(`OOS: ${product?.title || 'Unknown Product'}`);
        }
      }

      // Step B: Create Order & OrderItems[cite: 29]
      const order = await tx.order.create({
        data: {
          customerId: userId,
          storeId: storeId,
          totalAmount: cart.grandTotal,
          shippingCost: cart.shippingEstimate,
          shippingAddress: shippingAddress,
          status: "Pending",
          orderItems: {
            create: cart.items.map(item => ({
              productId: item.productId,
              quantity: item.quantity,
              priceAtPurchase: item.unitPrice
            }))
          }
        }
      });

      // Step C: Decrement Product Stock[cite: 29]
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

    // Step D: Delete Redis Cart key[cite: 16, 25]
    await redisClient.del(`cart:${userId}`);

    return result.id; 
  }
}