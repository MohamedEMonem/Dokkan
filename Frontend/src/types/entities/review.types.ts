import { WithId } from '@/types/core/entity.types';
import { OptionalAudited, SoftDeleted } from '@/types/core/audit.types';

/* ────────────────────────────────────────────────────────
 * Review Interfaces
 * ──────────────────────────────────────────────────────── */

export interface IReviewInfo {
  productId: number;
  customerId: number;
  orderId: number;
  rating: number;
  reviewText?: string;
  storeResponse?: string;
}

/* ────────────────────────────────────────────────────────
 * Composition
 * ──────────────────────────────────────────────────────── */
export type IReview = WithId<OptionalAudited<SoftDeleted<IReviewInfo>>>;
