import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt.utils';
import { AppError } from './error.middleware';

/**
 * Middleware: verifies the JWT Bearer token from the Authorization header.
 * Attaches the decoded user payload to req.user on success.
 * Returns 401 on missing, invalid, or expired tokens.
 */
export const authMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new AppError('Authentication token is missing', 401);
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    throw new AppError('Authentication token is missing', 401);
  }

  try {
    const decoded = verifyToken(token);
    req.user = { id: decoded.id, role: decoded.role };
    next();
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'TokenExpiredError') {
        throw new AppError('Authentication token has expired', 401);
      }
      if (error.name === 'JsonWebTokenError') {
        throw new AppError('Invalid authentication token', 401);
      }
    }
    throw new AppError('Authentication failed', 401);
  }
};
