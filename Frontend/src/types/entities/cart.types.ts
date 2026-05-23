import { WithId } from "@/types/core/entity.types";
import { SoftDeleted } from "@/types/core/audit.types";

/* ────────────────────────────────────────────────────────
 * Cart Interfaces
 * ──────────────────────────────────────────────────────── */

export interface ICartResponseItem {
  productId: string;
  title: string;
  quantity: number;
  unitPrice: number;
  lineTotal?: number;
  imageUrl: string | null;
  inStock?: boolean;
}

export interface ICartStore {
  storeId: string;
  storeName: string;
  items: ICartResponseItem[];
  storeTotal: number;
}

export interface ICartResponse {
  stores: ICartStore[];
  itemsTotal: number;
  shippingEstimate: number;
  taxEstimate: number;
  grandTotal: number;
}

export interface ICartRequest {
  productId: string;
  quantity: number;
}

export interface ICartItemInfo {
  cartId: string;
  productId: string;
  quantity: number;
}

export interface ICartInfo {
  customerId: string;
  expiresAt?: Date;
  cartItems?: ICartItem[];
}

/* ────────────────────────────────────────────────────────
 * Composition
 * ──────────────────────────────────────────────────────── */
export type ICartItem = WithId<SoftDeleted<ICartItemInfo>>;
export type ICart = WithId<SoftDeleted<ICartInfo>>;
