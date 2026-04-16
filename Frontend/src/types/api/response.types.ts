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

export interface IPaginatedResponse<T> extends IAPIResponse<T[]> {
  totalCount: number;
  totalPages: number;
  page?: number;
  limit?: number;
}
