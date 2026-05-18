import { apiClient } from './client';
import { ApiResponse, AuthResponse } from '@/types';

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role?: 'admin' | 'sales_user';
}

export interface LoginPayload {
  email: string;
  password: string;
}

/**
 * Registers a new user account.
 */
export const registerApi = async (
  payload: RegisterPayload
): Promise<ApiResponse<AuthResponse>> => {
  const { data } = await apiClient.post<ApiResponse<AuthResponse>>(
    '/auth/register',
    payload
  );
  return data;
};

/**
 * Authenticates a user and returns a JWT token.
 */
export const loginApi = async (
  payload: LoginPayload
): Promise<ApiResponse<AuthResponse>> => {
  const { data } = await apiClient.post<ApiResponse<AuthResponse>>(
    '/auth/login',
    payload
  );
  return data;
};
