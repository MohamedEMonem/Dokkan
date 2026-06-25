/* ────────────────────────────────────────────────────────
 * Standard Response
 * ──────────────────────────────────────────────────────── */

export interface IAPIResponse<T> {
  success: boolean;
  data: T;
  message?: string | null;
  error?: unknown;
  code?: number;
}

/* ────────────────────────────────────────────────────────
 * Paginated Response
 * ──────────────────────────────────────────────────────── */

export interface IPaginatedMeta {
  total: number;
  totalPages: number;
  page: number;
  limit: number;
}

export type IPaginatedResponse<T, K extends string = "items"> = IAPIResponse<
  { meta: IPaginatedMeta } & Record<K, T[]>
>;
