import { WithId } from '@/types/core/entity.types';
import { SoftDeleted, OptionalAudited } from '@/types/core/audit.types';

/* ────────────────────────────────────────────────────────
 * Store Enums
 * ──────────────────────────────────────────────────────── */
export enum EStoreStatus {
  Pending = 'Pending',
  Active = 'Active',
  Suspended = 'Suspended'
}

/* ────────────────────────────────────────────────────────
 * Store Interfaces
 * ──────────────────────────────────────────────────────── */

export interface IStoreEmployee {
  userId: string;
  storeId: string;
  permissions?: Record<string, unknown>;
}

export interface IStoreAnalyticsParams {
  granularity?: "day" | "week" | "month";
  from?: string;
  to?: string;
}

export interface IStoreAnalyticsResponse {
  revenue: {
    totalRevenue: number;
    orderCount?: number;
    totalOrders?: number;
    averageOrderValue?: number;
  };
  salesOverTime: Array<{
    period?: string;
    date?: string;
    totalRevenue?: number;
    sales?: number;
    orderCount?: number;
  }>;
  topProducts: Array<{
    productId?: string;
    product?: { id: string; title: string; price: number };
    title?: string;
    unitsSold?: number;
    totalQuantity?: number;
    totalRevenue?: number;
    orderCount?: number;
  }>;
}

export interface IStoreInfo {
  ownerId: string;
  name: string;
  subdomain: string;
  status: EStoreStatus;
  description?: string;
  logoUrl?: string;
  coverBannerUrl?: string;
  businessAddress?: string;
  vatNumber?: string;
  themeSettings?: Record<string, unknown>;
  supportEmail?: string;
  phoneNumber?: string;
  operatingHours?: string | Record<string, unknown>;
  socialMediaLinks?: string | Record<string, unknown>;
  averageRating?: number;
  reviewCount?: number;
  owner?: {
    id: string;
    name: string;
    email?: string;
  };
}

/* ────────────────────────────────────────────────────────
 * Composition
 * ──────────────────────────────────────────────────────── */
export type IStore = WithId<OptionalAudited<SoftDeleted<IStoreInfo>>>;
