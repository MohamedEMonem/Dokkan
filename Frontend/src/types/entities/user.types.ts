import { WithId } from '@/types/core/entity.types';
import { SoftDeleted, type OptionalAudited } from '@/types/core/audit.types';

export enum EUserRole {
  Customer = 'Customer',
  StoreOwner = 'StoreOwner',
  Admin = 'Admin'
}


export interface IUserBase {
  name: string;
  email: string;
  role: EUserRole;
  contactNumber?: string;
  profilePhotoUrl?: string;
  googleOauthId?: string;
  isVerified: boolean;
}

export interface IStoreOwner extends IUserBase {
  role: EUserRole.StoreOwner;
}

export interface IAdmin extends IUserBase {
  role: EUserRole.Admin;
}

export interface ICustomer extends IUserBase {
  role: EUserRole.Customer;
}


export type IUser = WithId<OptionalAudited<SoftDeleted<IUserBase>>>;
