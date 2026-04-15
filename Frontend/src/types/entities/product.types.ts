import { WithId } from '@/types/core/entity.types';
import { SoftDeleted, OptionalAudited } from '@/types/core/audit.types';

export enum EProductStatus {
  Active = 'Active',
  Inactive = 'Inactive'
}

export interface IProductImageBase {
  productId: number;
  imageUrl: string;
  sortOrder?: number;
}


export interface IProductBase {
  storeId: number;
  categoryId: number;
  title: string;
  description?: string;
  price: number; 
  stockQuantity: number;
  status: EProductStatus;  
  images?: IProductImage[];
}

export type IProduct = WithId<OptionalAudited<SoftDeleted<IProductBase>>>;
export type IProductImage = WithId<IProductImageBase>;
