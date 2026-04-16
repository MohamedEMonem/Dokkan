import { WithId } from '@/types/core/entity.types';
import { SoftDeleted, OptionalAudited } from '@/types/core/audit.types';

/* ────────────────────────────────────────────────────────
 * Product Enums
 * ──────────────────────────────────────────────────────── */
export enum EProductStatus {
  Active = 'Active',
  Inactive = 'Inactive'
}

/* ────────────────────────────────────────────────────────
 * Product Interfaces
 * ──────────────────────────────────────────────────────── */

export interface IProductImageInfo {
  productId: number;
  imageUrl: string;
  sortOrder?: number;
}

export interface IProductInfo {
  storeId: number;
  categoryId: number;
  title: string;
  description?: string;
  price: number; 
  stockQuantity: number;
  status: EProductStatus;  
  images?: IProductImage[];
}

/* ────────────────────────────────────────────────────────
 * Composition
 * ──────────────────────────────────────────────────────── */
export type IProduct = WithId<OptionalAudited<SoftDeleted<IProductInfo>>>;
export type IProductImage = WithId<IProductImageInfo>;
