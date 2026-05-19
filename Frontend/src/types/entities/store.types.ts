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

export interface IStoreAnalytics {
  receiverId: string;
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
}

/* ────────────────────────────────────────────────────────
 * Composition
 * ──────────────────────────────────────────────────────── */
export type IStore = WithId<OptionalAudited<SoftDeleted<IStoreInfo>>>;
