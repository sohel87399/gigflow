import { Request, Response } from 'express';
import { registerUser, loginUser } from '../services/auth.service';
import { RegisterInput, LoginInput } from '../schemas/auth.schema';
import { ApiResponse } from '../types';
import { asyncHandler } from '../utils/asyncHandler';

export const register = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const input = req.body as RegisterInput;
  const result = await registerUser(input);

  const response: ApiResponse<typeof result> = {
    success: true,
    message: 'Account created successfully',
    data: result,
  };

  res.status(201).json(response);
});

export const login = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const input = req.body as LoginInput;
  const result = await loginUser(input);

  const response: ApiResponse<typeof result> = {
    success: true,
    message: 'Login successful',
    data: result,
  };

  res.status(200).json(response);
});
