import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../types';
import { AppError } from './error.middleware';

/**
 * RBAC middleware factory.
 * Returns a middleware that allows access only to users whose role
 * is included in the provided list of allowed roles.
 *
 * @param roles - One or more roles that are permitted to access the route.
 *
 * @example
 * router.delete('/:id', authMiddleware, requireRole('admin'), deleteLeadHandler);
 */
export const requireRole =
  (...roles: UserRole[]) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new AppError('Not authenticated', 401);
    }

    if (!roles.includes(req.user.role)) {
      throw new AppError(
        `Access denied. Required role(s): ${roles.join(', ')}`,
        403
      );
    }

    next();
  };
