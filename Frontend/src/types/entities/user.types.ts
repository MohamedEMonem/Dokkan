import { WithId } from '@/types/core/entity.types';
import { SoftDeleted, type OptionalAudited } from '@/types/core/audit.types';

/* ────────────────────────────────────────────────────────
 * User Enums
 * ──────────────────────────────────────────────────────── */
export enum EUserRole {
  Customer = 'Customer',
  StoreOwner = 'StoreOwner',
  Admin = 'Admin'
}

/* ────────────────────────────────────────────────────────
 * User Interfaces
 * ──────────────────────────────────────────────────────── */

export interface IUserInfo {
  name: string;
  email: string;
  password: string;
  role: EUserRole;
  contactNumber?: string;
  profilePhotoUrl?: string;
  googleOauthId?: string;
  isVerified: boolean;
}

// ── Role Specific Extensions ─────────────────────────── //

export interface IStoreOwner extends IUserInfo {
  role: EUserRole.StoreOwner;
}

export interface IAdmin extends IUserInfo {
  role: EUserRole.Admin;
}

export interface ICustomer extends IUserInfo {
  role: EUserRole.Customer;
}

/* ────────────────────────────────────────────────────────
 * Composition
 * ──────────────────────────────────────────────────────── */
export type IUser = WithId<OptionalAudited<SoftDeleted<ICustomer | IStoreOwner | IAdmin>>>;
