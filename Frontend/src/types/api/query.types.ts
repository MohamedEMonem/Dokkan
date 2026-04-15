export enum ESortDirection {
    Asc = "asc",
    Desc = "desc",
}

export interface IQueryOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortDir?: ESortDirection;
  search?: string;
  [key: string]: any;
}