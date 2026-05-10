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

        return res.status(400).json({
          message: 'Validation failed',
          errors: formattedErrors,
        });
      }

      next(error);
    }
  };
};