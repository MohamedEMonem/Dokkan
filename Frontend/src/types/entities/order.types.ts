import { WithId } from "@/types/core/entity.types";
import { SoftDeleted, OptionalAudited } from "@/types/core/audit.types";

/* ────────────────────────────────────────────────────────
 * Order Enums
 * ──────────────────────────────────────────────────────── */
export enum EOrderStatus {
  Pending = "Pending",
  Shipped = "Shipped",
  Delivered = "Delivered",
  Cancelled = "Cancelled",
}

export enum EPaymentStatus {
  Pending = "Pending",
  Success = "Success",
  Failed = "Failed",
}

export enum orderSortByValues {
  CreatedAt = "createdAt",
  Status = "status",
  TotalAmount = "totalAmount",
}

export enum orderSortDirValues {
  Asc = "asc",
  Desc = "desc",
}
/* ────────────────────────────────────────────────────────
 * Order Interfaces
 * ──────────────────────────────────────────────────────── */

export interface IOrderItemInfo {
  orderId: string;
  productId: string;
  quantity: number;
  priceAtPurchase: number;
  product: {
    id: string;
    title: string;
  };
}

export interface IOrderInfo {
  customerId: string;
  storeId: string;
  status: EOrderStatus;
  shippingAddress?: {
    city: string;
    email: string;
    line1: string;
    country: string;
    username: string;
    postalCode: string;
    phoneNumber: string;
  };
  totalAmount: number;
  shippingCost?: number;
  taxAmount?: number;
  paymentStatus: EPaymentStatus;
  orderItems?: IOrderItem[];
  createdAt?: string;
  deletedAt?: string | null;
  customer?: {
    id: string;
    name: string;
    email: string;
  };
  store?: {
    id: string;
    name: string;
    subdomain: string;
    ownerId: string;
  };
}

export type createOrderRequest = {
  username: string;
  phoneNumber: number;
  email: string;
  shippingAddress: shippingAddress;
};
export type shippingAddress = {
  line1?: string;
  line2: string;
  city: string;
  country: string;
  postalCode?: string;
};
export type GetOrdersQueryParams = {
  page?: number;
  limit?: number;
  status?: typeof EOrderStatus;
  sortBy?: typeof orderSortByValues;
  sortDir?: typeof orderSortDirValues;
};
/* ────────────────────────────────────────────────────────
 * Composition
 * ──────────────────────────────────────────────────────── */
export type IOrderItem = WithId<IOrderItemInfo>;
export type IOrder = WithId<OptionalAudited<SoftDeleted<IOrderInfo>>>;
