export interface IAPIResponse<T> {
  data: T;
  message: string;
  statusCode: number;
  success: boolean;
}

export interface IPaginatedResponse<T> extends IAPIResponse<T[]> {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
