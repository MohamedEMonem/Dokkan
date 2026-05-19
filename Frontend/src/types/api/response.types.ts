/* ────────────────────────────────────────────────────────
 * Standard Response
 * ──────────────────────────────────────────────────────── */

export interface IAPIResponse<T> {
  data: T;
  message?: string;
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
