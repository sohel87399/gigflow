import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { AppError } from './error.middleware';

/**
 * Middleware factory that validates the incoming request against a Zod schema.
 * The schema should validate an object with optional keys: body, query, params.
 *
 * @param schema - A Zod schema that validates { body?, query?, params? }
 *
 * @example
 * router.post('/', validate(createLeadSchema), createLeadHandler);
 */
export const validate =
  (schema: ZodSchema) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    try {
      const parsed = schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      // Assign validated + transformed values back to the request
      if (parsed.body !== undefined) req.body = parsed.body;
      if (parsed.query !== undefined) req.query = parsed.query;
      if (parsed.params !== undefined) req.params = parsed.params;

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const messages = error.errors
          .map((e) => `${e.path.slice(1).join('.')}: ${e.message}`)
          .join('; ');
        throw new AppError(`Validation error: ${messages}`, 400);
      }
      throw error;
    }
  };
