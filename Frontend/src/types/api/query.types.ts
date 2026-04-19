/* ────────────────────────────────────────────────────────
 * Query Enums
 * ──────────────────────────────────────────────────────── */
export enum ESortDirection {
  ASC = 'asc',
  DESC = 'desc'
}

/* ────────────────────────────────────────────────────────
 * API Query Interfaces
 * ──────────────────────────────────────────────────────── */

export interface IQueryOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: ESortDirection;
  searchTerm?: string;
  filters?: Record<string, unknown>;
}