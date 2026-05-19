import { Request, Response, NextFunction, RequestHandler } from 'express';

/**
 * Wraps an async route handler so any thrown error is forwarded to next().
 * Replaces express-async-errors for serverless compatibility.
 */
export const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>): RequestHandler =>
  (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
