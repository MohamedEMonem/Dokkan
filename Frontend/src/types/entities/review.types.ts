import { WithId } from '@/types/core/entity.types';
import { OptionalAudited, SoftDeleted } from '@/types/core/audit.types';

export interface IReviewInfo {
  productId: number;
  customerId: number;
  orderId: number;
  rating: number;
  reviewText?: string;
  storeResponse?: string;
}

export type IReview = WithId<OptionalAudited<SoftDeleted<IReviewInfo>>>;
