import { WithId } from '@/types/core/entity.types';
import { SoftDeleted, OptionalAudited } from '@/types/core/audit.types';

export enum EStoreStatus {
  Pending = 'Pending',
  Active = 'Active',
  Suspended = 'Suspended'
}

export interface IStoreEmployee {
  userId: number;
  storeId: number;
  permissions?: Record<string, any>;
}

export interface IStoreAnalytics {
  receiverId: number;
}

export interface IStoreInfo {
  ownerId: number;
  name: string;
  subdomain: string;
  status: EStoreStatus;
  description?: string;
  logoUrl?: string;
  coverBannerUrl?: string;
  businessAddress?: string;
  vatNumber?: string;
  themeSettings?: Record<string, any>;
}

export type IStore = WithId<OptionalAudited<SoftDeleted<IStoreInfo>>>;
