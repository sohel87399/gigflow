import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/store/authStore';
import { loginApi, registerApi, LoginPayload, RegisterPayload } from '@/api/auth.api';
import { AxiosError } from 'axios';
import { ApiResponse } from '@/types';

/**
 * Hook that provides login and register mutations with toast feedback.
 */
export const useAuth = () => {
  const navigate = useNavigate();
  const { login, logout, user, isAuthenticated } = useAuthStore();

  const loginMutation = useMutation({
    mutationFn: (payload: LoginPayload) => loginApi(payload),
    onSuccess: (response) => {
      if (response.success && response.data) {
        login(response.data.user, response.data.token);
        toast.success('Welcome back!');
        navigate('/dashboard');
      }
    },
    onError: (error: AxiosError<ApiResponse<null>>) => {
      const message =
        error.response?.data?.message ?? 'Login failed. Please try again.';
      toast.error(message);
    },
  });

  const registerMutation = useMutation({
    mutationFn: (payload: RegisterPayload) => registerApi(payload),
    onSuccess: (response) => {
      if (response.success && response.data) {
        login(response.data.user, response.data.token);
        toast.success('Account created successfully!');
        navigate('/dashboard');
      }
    },
    onError: (error: AxiosError<ApiResponse<null>>) => {
      const message =
        error.response?.data?.message ?? 'Registration failed. Please try again.';
      toast.error(message);
    },
  });

  return {
    user,
    isAuthenticated,
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout,
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
  };
};
