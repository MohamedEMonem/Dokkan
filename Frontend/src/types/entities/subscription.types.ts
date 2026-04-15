import { WithId } from '@/types/core/entity.types';
import { SoftDeleted } from '@/types/core/audit.types';

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

export type IPlan = WithId<IPlanInfo>;
export type ISubscription = WithId<SoftDeleted<ISubscriptionInfo>>;
