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

export interface IUserBase {
  name: string;
  email: string;
  role: EUserRole;
  contactNumber?: string;
  profilePhotoUrl?: string;
  googleOauthId?: string;
  isVerified: boolean;
}

// ── Role Specific Extensions ─────────────────────────── //

export interface IStoreOwner extends IUserBase {
  role: EUserRole.StoreOwner;
}

export interface IAdmin extends IUserBase {
  role: EUserRole.Admin;
}

export interface ICustomer extends IUserBase {
  role: EUserRole.Customer;
}

/* ────────────────────────────────────────────────────────
 * Composition
 * ──────────────────────────────────────────────────────── */
export type IUser = WithId<OptionalAudited<SoftDeleted<IUserBase>>>;
