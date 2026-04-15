import { WithId } from '@/types/core/entity.types';
import { SoftDeleted } from '@/types/core/audit.types';

export interface ICartItemInfo {
  cartId: number;
  productId: number;
  quantity: number;
}


export interface ICartInfo {
  customerId: number;
  expiresAt?: Date;
  cartItems?: ICartItem[];
}

export type ICartItem = WithId<SoftDeleted<ICartItemInfo>>;
export type ICart = WithId<SoftDeleted<ICartInfo>>;
