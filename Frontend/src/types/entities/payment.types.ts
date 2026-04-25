import { WithId } from '@/types/core/entity.types';
import { type OptionalAudited } from '@/types/core/audit.types';

/* ────────────────────────────────────────────────────────
 * Payment Enums
 * ──────────────────────────────────────────────────────── */
export enum ETransactionStatus {
  SUCCESS = 'Success',
  FAILURE = 'Failure'
}

export enum EPayableType {
  ORDER = 'Order',
  SUBSCRIPTION = 'Subscription'
}

/* ────────────────────────────────────────────────────────
 * Payment Interfaces
 * ──────────────────────────────────────────────────────── */

export interface IPaymentTransactionInfo {
  payableId: string;
  payableType: EPayableType;
  gatewayName?: string;
  gatewayTransactionId?: string;
  amount: number;
  status: ETransactionStatus;
}

/* ────────────────────────────────────────────────────────
 * Composition
 * ──────────────────────────────────────────────────────── */
export type IPaymentTransaction = WithId<OptionalAudited<IPaymentTransactionInfo>>;
