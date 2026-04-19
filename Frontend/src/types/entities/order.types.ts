import { WithId } from '@/types/core/entity.types';
import { SoftDeleted, OptionalAudited } from '@/types/core/audit.types';

/* ────────────────────────────────────────────────────────
 * Order Enums
 * ──────────────────────────────────────────────────────── */
export enum EOrderStatus {
  Pending = 'Pending',
  Shipped = 'Shipped',
  Delivered = 'Delivered',
  Cancelled = 'Cancelled'
}

export enum EPaymentStatus {
  Pending = 'Pending',
  Success = 'Success',
  Failed = 'Failed'
}

/* ────────────────────────────────────────────────────────
 * Order Interfaces
 * ──────────────────────────────────────────────────────── */

export interface IOrderItemInfo {
  orderId: number;
  productId: number;
  quantity: number;
  priceAtPurchase: number;
}

export interface IOrderInfo {
  customerId: number;
  storeId: number;
  status: EOrderStatus;
  shippingAddress?: Record<string, unknown>;
  totalAmount: number;
  shippingCost?: number;
  taxAmount?: number;
  paymentStatus: EPaymentStatus;
  orderItems?: IOrderItem[];
}

/* ────────────────────────────────────────────────────────
 * Composition
 * ──────────────────────────────────────────────────────── */
export type IOrderItem = WithId<IOrderItemInfo>;
export type IOrder = WithId<OptionalAudited<SoftDeleted<IOrderInfo>>>;
