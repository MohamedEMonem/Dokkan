import { WithId } from '@/types/core/entity.types';
import { OptionalAudited, SoftDeleted } from '@/types/core/audit.types';

/* ────────────────────────────────────────────────────────
 * Category Interfaces
 * ──────────────────────────────────────────────────────── */

export interface ICategoryInfo {
  name: string;
}

/* ────────────────────────────────────────────────────────
 * Composition
 * ──────────────────────────────────────────────────────── */
export type ICategory = WithId<OptionalAudited<SoftDeleted<ICategoryInfo>>>;
