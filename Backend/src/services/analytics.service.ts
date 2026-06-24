import { PaymentStatus , Prisma} from '@prisma/client'
import prisma from '../config/db.js'


export class AnalyticsService {

  /**
   * Get total revenue for a store.
   * @param storeId Store identifier.
   * @param from Optional start date for the range.
   * @param to Optional end date for the range.
   */
  async getTotalRevenue(storeId: string, from?: Date, to?: Date) {
    const result = await prisma.order.aggregate({
      where: {
        storeId,
        paymentStatus: PaymentStatus.Success,
        // Enhancement: optional date range
        createdAt: {
          ...(from && { gte: from }),
          ...(to   && { lte: to   }),
        },
      },
      _sum: { totalAmount: true },
      _count: { id: true },
    });

    return {
      totalRevenue: result._sum.totalAmount ?? 0,
      orderCount:   result._count.id,
    };
  }

  /**
   * Get sales totals over time for a store.
   * @param storeId Store identifier.
   * @param granularity Time bucket size.
   * @param from Optional start date for the range.
   * @param to Optional end date for the range.
   */
async getSalesOverTime(
  storeId: string,
  granularity: 'day' | 'week' | 'month' = 'day',
  from?: Date,
  to?: Date,
) {
  const rows = await prisma.$queryRaw<
    Array<{ period: Date; total_revenue: string; order_count: bigint }>
  >`
    SELECT
      DATE_TRUNC(${granularity}, "created_at") AS period,
      SUM("total_amount")                      AS total_revenue,
      COUNT(*)                                 AS order_count
    FROM "Orders"
    WHERE
      "store_id"       = ${storeId}::uuid
      AND "payment_status" = 'Success'
      ${from ? Prisma.sql`AND "created_at" >= ${from}` : Prisma.empty}
      ${to   ? Prisma.sql`AND "created_at" <= ${to}`   : Prisma.empty}
    GROUP BY 1  -- This safely groups by the 1st column (period)
    ORDER BY 1 ASC
  `;

  return rows.map(r => ({
    period:       r.period,
    totalRevenue: parseFloat(r.total_revenue),
    orderCount:   Number(r.order_count),
  }));
}
  /**
   * Get the top-selling products for a store.
   * @param storeId Store identifier.
   * @param limit Maximum number of products to return.
   * @param from Optional start date for the range.
   * @param to Optional end date for the range.
   */
  async getTopProducts(storeId: string, limit = 10, from?: Date, to?: Date) {
    const results = await prisma.orderItem.groupBy({
      by: ['productId'],
      where: {
        order: {
          storeId,
          paymentStatus: PaymentStatus.Success,
          createdAt: {
            ...(from && { gte: from }),
            ...(to   && { lte: to   }),
          },
        },
      },
      _sum: { quantity: true },
      _count: { id: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: limit,
    });

    // Enrich with product name in a single IN query (avoids N+1)
    const productIds = results.map(r => r.productId);
    const products   = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, title: true, price: true },
    });
    const productMap = Object.fromEntries(products.map(p => [p.id, p]));

    return results.map(r => ({
      product:    productMap[r.productId],
      unitsSold:  r._sum.quantity ?? 0,
      orderCount: r._count.id,
    }));
  }


}