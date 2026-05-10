import type { Response } from "express";

type ResponsePayload<T> = {
  success: boolean;
  data: T | null;
  message: string | null;
  error: unknown;
  code: number;
};

export const sendSuccess = <T>(
  res: Response,
  data: T | null = null,
  message: string | null = null,
  statusCode = 200,
) => {
  return res.status(statusCode).json({
    success: true,
    data,
    message,
    error: null,
    code: statusCode,
  } as ResponsePayload<T>);
};

export const sendError = (
  res: Response,
  message: string,
  statusCode = 400,
  error: unknown = null,
) => {
  return res.status(statusCode).json({
    success: false,
    data: null,
    message,
    error: error || message,
    code: statusCode,
  } as ResponsePayload<null>);
};

export const sendValidationError = (res: Response, errors: unknown) => {
  return res.status(422).json({
    success: false,
    data: null,
    message: "Validation failed",
    error: errors,
    code: 422,
  } as ResponsePayload<null>);
};

export const sendNotFound = (res: Response, message = "Resource not found") => {
  return res.status(404).json({
    success: false,
    data: null,
    message,
    error: message,
    code: 404,
  } as ResponsePayload<null>);
};

export const sendUnauthorized = (res: Response, message = "Unauthorized") => {
  return res.status(401).json({
    success: false,
    data: null,
    message,
    error: message,
    code: 401,
  } as ResponsePayload<null>);
};

export const sendForbidden = (res: Response, message = "Access forbidden") => {
  return res.status(403).json({
    success: false,
    data: null,
    message,
    error: message,
    code: 403,
  } as ResponsePayload<null>);
};

export const sendRateLimitExceeded = (
  res: Response,
  message = "Rate limit exceeded",
) => {
  return res.status(429).json({
    success: false,
    data: null,
    message,
    error: message,
    code: 429,
  } as ResponsePayload<null>);
};

export const sendServerError = (
  res: Response,
  message = "Internal server error",
  error: unknown = null,
) => {
  if (error) {
    console.error("Server Error:", error);
  }

  return res.status(500).json({
    success: false,
    data: null,
    message,
    error:
      process.env.NODE_ENV === "development" ? error : "Internal server error",
    code: 500,
  } as ResponsePayload<null>);
};
