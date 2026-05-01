import { WithId } from '@/types/core/entity.types';

/* ────────────────────────────────────────────────────────
 * Category Interfaces
 * ──────────────────────────────────────────────────────── */

export interface ICategoryInfo {
  name: string;
  parentCategoryId?: string | null;
}

/* ────────────────────────────────────────────────────────
 * Composition
 * ──────────────────────────────────────────────────────── */
export type ICategory = WithId<ICategoryInfo>;
