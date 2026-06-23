import { WithId } from "@/types/core/entity.types";
import { SoftDeleted, OptionalAudited } from "@/types/core/audit.types";
import { IStore } from "./store.types";

/* ────────────────────────────────────────────────────────
 * Product Enums
 * ──────────────────────────────────────────────────────── */
export enum EProductStatus {
  Active = "Active",
  Inactive = "Inactive",
}

/* ────────────────────────────────────────────────────────
 * Product Interfaces
 * ──────────────────────────────────────────────────────── */

export interface IProductImageInfo {
  productId: string;
  imageUrl: string;
  sortOrder?: number;
}

export interface IProductInfo {
  storeId: string;
  categoryId: string;
  subCategoryId: string;
  title: string;
  description?: string;
  price: number;
  stockQuantity: number;
  status: EProductStatus;
  images?: IProductImage[];
  store?: Pick<IStore, "id" | "name" | "subdomain">;
}

/* ────────────────────────────────────────────────────────
 * Composition
 * ──────────────────────────────────────────────────────── */
export type IProduct = WithId<OptionalAudited<SoftDeleted<IProductInfo>>>;
export type IProductImage = WithId<IProductImageInfo>;
