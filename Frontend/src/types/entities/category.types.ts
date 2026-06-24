import { WithId } from '@/types/core/entity.types';

/* ────────────────────────────────────────────────────────
 * Category Interfaces
 * ──────────────────────────────────────────────────────── */

export interface ISubCategory {
  id: string;
  name: string;
  categoryId: string;
}

export interface ICategoryInfo {
  name: string;
  parentCategoryId?: string | null;
  subCategories?: ISubCategory[];
}

/* ────────────────────────────────────────────────────────
 * Composition
 * ──────────────────────────────────────────────────────── */
export type ICategory = WithId<ICategoryInfo>;
