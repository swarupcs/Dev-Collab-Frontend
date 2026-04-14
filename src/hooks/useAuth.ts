import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authService } from '@/services/auth.service';
import { useAppDispatch } from '@/store/hooks';
import { setCredentials, logout as logoutAction } from '@/store/slices/authSlice';
import type { LoginCredentials, RegisterData } from '@/types/api';
import { getErrorMessage } from '@/api/client';

// Query keys
export const authKeys = {
  me: ['auth', 'me'] as const,
};

// Get current user
export const useCurrentUser = () => {
  return useQuery({
    queryKey: authKeys.me,
    queryFn: authService.getCurrentUser,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Register mutation
export const useRegister = () => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RegisterData) => authService.register(data),
    onSuccess: (data) => {
      dispatch(setCredentials(data));
      queryClient.setQueryData(authKeys.me, data.user);
    },
  });
};

// Login mutation
export const useLogin = () => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) =>
      authService.login(credentials),
    onSuccess: (data) => {
      dispatch(setCredentials(data));
      queryClient.setQueryData(authKeys.me, data.user);
    },
  });
};

// Logout mutation
export const useLogout = () => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      dispatch(logoutAction());
      queryClient.clear();
    },
  });
};

// Logout all devices mutation
export const useLogoutAll = () => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.logoutAll,
    onSuccess: () => {
      dispatch(logoutAction());
      queryClient.clear();
    },
  });
};

// Change password mutation
export const useChangePassword = () => {
  return useMutation({
    mutationFn: (data: { currentPassword: string; newPassword: string }) =>
      authService.changePassword(data),
  });
};
