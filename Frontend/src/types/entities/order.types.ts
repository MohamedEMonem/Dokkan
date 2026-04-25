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
  orderId: string;
  productId: string;
  quantity: number;
  priceAtPurchase: number;
}

export interface IOrderInfo {
  customerId: string;
  storeId: string;
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
