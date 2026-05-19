import { Request, Response } from 'express';
import {
  updateProfile,
  changePassword,
  deleteAccount,
} from '../services/settings.service';
import {
  UpdateProfileInput,
  ChangePasswordInput,
} from '../schemas/settings.schema';
import { ApiResponse } from '../types';

/**
 * PUT /api/auth/profile
 * Updates the authenticated user's name and/or email.
 */
export const updateProfileHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const input = req.body as UpdateProfileInput;
  const userId = req.user!.id;

  const updatedUser = await updateProfile(userId, input);

  const response: ApiResponse<typeof updatedUser> = {
    success: true,
    message: 'Profile updated successfully',
    data: updatedUser,
  };

  res.status(200).json(response);
};

/**
 * PUT /api/auth/password
 * Changes the authenticated user's password.
 */
export const changePasswordHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const input = req.body as ChangePasswordInput;
  const userId = req.user!.id;

  await changePassword(userId, input);

  const response: ApiResponse<null> = {
    success: true,
    message: 'Password changed successfully',
  };

  res.status(200).json(response);
};

/**
 * DELETE /api/auth/account
 * Permanently deletes the authenticated user's account.
 */
export const deleteAccountHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = req.user!.id;

  await deleteAccount(userId);

  const response: ApiResponse<null> = {
    success: true,
    message: 'Account deleted successfully',
  };

  res.status(200).json(response);
};
