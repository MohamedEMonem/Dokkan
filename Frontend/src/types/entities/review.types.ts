import { WithId } from '@/types/core/entity.types';
import { OptionalAudited, SoftDeleted } from '@/types/core/audit.types';

/* ────────────────────────────────────────────────────────
 * Review Interfaces
 * ──────────────────────────────────────────────────────── */

export interface IReviewInfo {
  productId: string;
  customerId: string;
  orderId: string;
  rating: number;
  reviewText?: string;
  storeResponse?: string;
}

/* ────────────────────────────────────────────────────────
 * Composition
 * ──────────────────────────────────────────────────────── */
export type IReview = WithId<OptionalAudited<SoftDeleted<IReviewInfo>>>;
