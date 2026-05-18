import { Request, Response, NextFunction } from 'express';
import { Error as MongooseError } from 'mongoose';
import { MongoServerError } from 'mongodb';
import { ApiResponse } from '../types';

/**
 * Custom application error class.
 * Carries an HTTP status code alongside the error message.
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Object.setPrototypeOf(this, AppError.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Centralized error-handling middleware.
 * Must be registered AFTER all routes in app.ts.
 */
export const errorMiddleware = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // Operational / known errors
  if (err instanceof AppError) {
    const response: ApiResponse<null> = {
      success: false,
      message: err.message,
      error: err.message,
    };
    res.status(err.statusCode).json(response);
    return;
  }

  // Mongoose validation errors → 400
  if (err instanceof MongooseError.ValidationError) {
    const messages = Object.values(err.errors)
      .map((e) => e.message)
      .join('; ');
    const response: ApiResponse<null> = {
      success: false,
      message: 'Validation failed',
      error: messages,
    };
    res.status(400).json(response);
    return;
  }

  // MongoDB duplicate key error → 409
  if (err instanceof MongoServerError && err.code === 11000) {
    const field = Object.keys(err.keyValue ?? {})[0] ?? 'field';
    const response: ApiResponse<null> = {
      success: false,
      message: `Duplicate value for ${field}`,
      error: `A record with this ${field} already exists`,
    };
    res.status(409).json(response);
    return;
  }

  // JWT errors → 401
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    const response: ApiResponse<null> = {
      success: false,
      message: 'Invalid or expired token',
      error: err.message,
    };
    res.status(401).json(response);
    return;
  }

  // Unhandled / unexpected errors → 500
  const response: ApiResponse<null> = {
    success: false,
    message: 'Internal server error',
    error:
      process.env.NODE_ENV === 'development'
        ? err.message
        : 'Something went wrong',
  };
  res.status(500).json(response);
};
