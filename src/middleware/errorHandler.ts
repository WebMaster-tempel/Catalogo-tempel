import { Request, Response, NextFunction } from 'express';
import { ValidationError } from 'joi';

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction): void => {
  let statusCode = 500;
  let message = 'Internal server error';
  let code = 'INTERNAL_ERROR';
  let details: any = undefined;

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    code = err.code || 'API_ERROR';
  } else if (err instanceof ValidationError) {
    statusCode = 400;
    code = 'VALIDATION_ERROR';
    message = 'Validation failed';
    details = err.details.map((d) => ({
      path: d.path.join('.'),
      message: d.message,
    }));
  } else if (err.message) {
    message = err.message;
    if (message.includes('already exists')) {
      statusCode = 409;
      code = 'DUPLICATE_ENTRY';
    } else if (message.includes('not found')) {
      statusCode = 404;
      code = 'NOT_FOUND';
    } else if (message.includes('Required attribute') || message.includes('must be')) {
      statusCode = 400;
      code = 'VALIDATION_ERROR';
    } else {
      statusCode = 500;
    }
  }

  res.status(statusCode).json({
    error: code,
    message,
    ...(details && { details }),
  });
};
