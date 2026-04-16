import { WithId } from '@/types/core/entity.types';
import { SoftDeleted } from '@/types/core/audit.types';

/* ────────────────────────────────────────────────────────
 * Subscription Interfaces
 * ──────────────────────────────────────────────────────── */

export interface IPlanInfo {
  name: string;
  price: number;
  features: Record<string, any>;
}

export interface ISubscriptionInfo {
  storeId: number;
  planId: number;
  status: string;
  nextBillingDate?: Date;
}

/* ────────────────────────────────────────────────────────
 * Composition
 * ──────────────────────────────────────────────────────── */
export type IPlan = WithId<IPlanInfo>;
export type ISubscription = WithId<SoftDeleted<ISubscriptionInfo>>;
