import { WithId } from '@/types/core/entity.types';
import { type OptionalAudited } from '@/types/core/audit.types';

export enum ETransactionStatus {
  SUCCESS = 'Success',
  FAILURE = 'Failure'
}

export enum EPayableType {
  ORDER = 'Order',
  SUBSCRIPTION = 'Subscription'
}

export interface IPaymentTransactionInfo {
  payableId: number;
  payableType: EPayableType;
  gatewayName?: string;
  gatewayTransactionId?: string;
  amount: number;
  status: ETransactionStatus;
}

export type IPaymentTransaction = WithId<OptionalAudited<IPaymentTransactionInfo>>;
