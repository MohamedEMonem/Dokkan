// src/controllers/analytics.controller.ts
import { Request, Response } from 'express';
import { AnalyticsService } from '../services/analytics.service.js';
import prisma from '../config/db.js';

const analyticsService = new AnalyticsService();

export const getStoreAnalytics = async (req: Request, res: Response) => {
    const user = req.user;
    const store = await prisma.store.findFirst({
      where: {
        ownerId: user?.id,
        },
    });
    const storeId = store!.id;
  const VALID_GRANULARITIES = ['day', 'week', 'month'] as const;
  type Granularity = typeof VALID_GRANULARITIES[number]
  const { from, to, granularity} = req.query;
 

  const fromDate = from ? new Date(from as string) : undefined;
  const toDate   = to   ? new Date(to   as string) : undefined;

  const [revenue, salesOverTime, topProducts] = await Promise.all([
    analyticsService.getTotalRevenue(storeId, fromDate, toDate),
    analyticsService.getSalesOverTime(storeId, (granularity as Granularity ) ?? 'day', fromDate, toDate),
    analyticsService.getTopProducts(storeId, 10, fromDate, toDate),
  ]);

  res.json({ revenue, salesOverTime, topProducts });
};