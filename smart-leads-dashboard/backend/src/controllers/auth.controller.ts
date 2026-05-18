import { Request, Response } from 'express';
import { registerUser, loginUser } from '../services/auth.service';
import { RegisterInput, LoginInput } from '../schemas/auth.schema';
import { ApiResponse } from '../types';

/**
 * POST /api/auth/register
 * Registers a new user and returns a JWT token.
 */
export const register = async (req: Request, res: Response): Promise<void> => {
  const input = req.body as RegisterInput;
  const result = await registerUser(input);

  const response: ApiResponse<typeof result> = {
    success: true,
    message: 'Account created successfully',
    data: result,
  };

  res.status(201).json(response);
};

/**
 * POST /api/auth/login
 * Authenticates a user and returns a JWT token.
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  const input = req.body as LoginInput;
  const result = await loginUser(input);

  const response: ApiResponse<typeof result> = {
    success: true,
    message: 'Login successful',
    data: result,
  };

  res.status(200).json(response);
};
