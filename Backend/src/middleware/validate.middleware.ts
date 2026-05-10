import { ZodError, ZodIssue, ZodTypeAny } from "zod";
import { Request, Response, NextFunction } from 'express';

export const validateBody = (schema: ZodTypeAny) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        const formattedErrors = error.issues.map((issue: ZodIssue) => ({
          field: issue.path.join('.'),
          message: issue.message,
        }));

        const err: any = new Error('Validation failed');
        err.status = 422;
        err.details = formattedErrors;
        return next(err);
      }

      return next(error);
    }
  };
};