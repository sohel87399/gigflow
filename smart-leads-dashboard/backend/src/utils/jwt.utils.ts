import jwt from 'jsonwebtoken';
import { JwtPayload, UserRole } from '../types';

/**
 * Signs a JWT token with the given payload.
 * Uses JWT_SECRET and JWT_EXPIRES_IN from environment variables.
 */
export const signToken = (id: string, role: UserRole): string => {
  const secret = process.env.JWT_SECRET;
  const expiresIn = process.env.JWT_EXPIRES_IN ?? '7d';

  if (!secret) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }

  const payload: JwtPayload = { id, role };
  return jwt.sign(payload, secret, { expiresIn } as jwt.SignOptions);
};

/**
 * Verifies a JWT token and returns the decoded payload.
 * Throws a JsonWebTokenError or TokenExpiredError on failure.
 */
export const verifyToken = (token: string): JwtPayload => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }

  return jwt.verify(token, secret) as JwtPayload;
};
