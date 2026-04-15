export enum EQueryErrorStatus {
  FETCH_ERROR = "FETCH_ERROR",
  PARSING_ERROR = "PARSING_ERROR",
  SERVER_ERROR = "SERVER_ERROR",
  TIMEOUT_ERROR = "TIMEOUT_ERROR",
  CUSTOM_ERROR = "CUSTOM_ERROR"
}

export interface IAPIErrorResponse {  
  code: number;
  success: boolean;
  data: null;
  message: string;
  error: string | Record<string, any> | any[];
}

export interface IRTKQueryError<T = IAPIErrorResponse> {
  status: EQueryErrorStatus;
  data?: T;
}
