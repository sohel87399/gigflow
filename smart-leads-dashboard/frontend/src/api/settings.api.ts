import { apiClient } from './client';
import { ApiResponse, User } from '@/types';

export interface UpdateProfilePayload {
  name?: string;
  email?: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

/**
 * PUT /api/auth/profile
 * Updates the authenticated user's name and/or email.
 */
export const updateProfileApi = async (
  payload: UpdateProfilePayload
): Promise<ApiResponse<User>> => {
  const { data } = await apiClient.put<ApiResponse<User>>(
    '/auth/profile',
    payload
  );
  return data;
};

/**
 * PUT /api/auth/password
 * Changes the authenticated user's password.
 */
export const changePasswordApi = async (
  payload: Omit<ChangePasswordPayload, 'confirmPassword'>
): Promise<ApiResponse<null>> => {
  const { data } = await apiClient.put<ApiResponse<null>>(
    '/auth/password',
    payload
  );
  return data;
};

/**
 * DELETE /api/auth/account
 * Permanently deletes the authenticated user's account.
 */
export const deleteAccountApi = async (): Promise<ApiResponse<null>> => {
  const { data } = await apiClient.delete<ApiResponse<null>>('/auth/account');
  return data;
};
