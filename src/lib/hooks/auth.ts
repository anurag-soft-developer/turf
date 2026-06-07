"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authApi } from "@/lib/api/auth";
import type {
  ChangePasswordFormData,
  LoginFormData,
  RegisterFormData,
  ResetPasswordFormData,
  UpdateNotificationSettingsFormData,
  UpdateProfileFormData,
  UpdateTwoFactorFormData,
  VerifyEmailFormData,
  VerifyLoginOtpFormData,
} from "@/lib/schemas/auth";
import { isAuthResponse } from "@/types/auth";
import { useRouter } from "next/navigation";
import {
  removeAuthToken,
  removeRefreshToken,
  setAuthToken,
  setRefreshToken,
} from "../utils/auth.util";
import { ROUTE_POINT } from "../constants/route-point";

export const AUTH_QUERY_KEYS = {
  profile: ["auth", "profile"],
  status: ["auth", "status"],
} as const;

function persistSession(accessToken: string, refreshToken: string) {
  setAuthToken(accessToken);
  setRefreshToken(refreshToken);
}

export const useLogin = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: LoginFormData) => authApi.login(data),
    onSuccess: (data) => {
      if (!isAuthResponse(data)) return;

      queryClient.setQueryData(AUTH_QUERY_KEYS.profile, data.user);
      persistSession(data.accessToken, data.refreshToken);
      router.push(ROUTE_POINT.dashboard());
      router.refresh();
    },
  });
};

export const useVerifyLoginOtp = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: VerifyLoginOtpFormData) => authApi.verifyLoginOtp(data),
    onSuccess: (data) => {
      queryClient.setQueryData(AUTH_QUERY_KEYS.profile, data.user);
      persistSession(data.accessToken, data.refreshToken);
      router.push(ROUTE_POINT.dashboard());
      router.refresh();
    },
  });
};

export const useRegister = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: RegisterFormData) => authApi.register(data),
    onSuccess: (data) => {
      queryClient.setQueryData(AUTH_QUERY_KEYS.profile, data.user);
      persistSession(data.accessToken, data.refreshToken);
      router.push(ROUTE_POINT.dashboard());
      router.refresh();
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      queryClient.clear();
      removeAuthToken();
      removeRefreshToken();
      router.push(ROUTE_POINT.auth.login);
      router.refresh();
    },
  });
};

export const useProfile = () => {
  return useQuery({
    queryKey: AUTH_QUERY_KEYS.profile,
    queryFn: authApi.getProfile,
    staleTime: 5 * 60 * 1000,
  });
};

export const useAuthStatus = () => {
  return useQuery({
    queryKey: AUTH_QUERY_KEYS.status,
    queryFn: authApi.getAuthStatus,
    staleTime: 5 * 60 * 1000,
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProfileFormData) => authApi.updateProfile(data),
    onSuccess: (data) => {
      queryClient.setQueryData(AUTH_QUERY_KEYS.profile, data);
    },
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: (data: ChangePasswordFormData) => authApi.changePassword(data),
  });
};

export const useSendChangePasswordOtp = () => {
  return useMutation({
    mutationFn: authApi.sendChangePasswordOtp,
  });
};

export const useSendTwoFactorOtp = () => {
  return useMutation({
    mutationFn: authApi.sendTwoFactorOtp,
  });
};

export const useUpdateTwoFactor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateTwoFactorFormData) =>
      authApi.updateTwoFactor(data),
    onSuccess: (data) => {
      queryClient.setQueryData(AUTH_QUERY_KEYS.profile, data);
    },
  });
};

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: (email: string) => authApi.forgotPassword(email),
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: ({ confirmPassword: _, ...data }: ResetPasswordFormData) =>
      authApi.resetPassword(data),
  });
};

export const useVerifyEmail = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: VerifyEmailFormData) => authApi.verifyEmail(data),
    onSuccess: (data) => {
      persistSession(data.accessToken, data.refreshToken);
      queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEYS.profile });
      router.push(ROUTE_POINT.dashboard());
      router.refresh();
    },
  });
};

export const useSendVerificationEmail = () => {
  return useMutation({
    mutationFn: (email: string) => authApi.sendVerificationEmail(email),
  });
};

export const useUpdateNotificationSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateNotificationSettingsFormData) =>
      authApi.updateNotificationSettings(data),
    onSuccess: (data) => {
      queryClient.setQueryData(AUTH_QUERY_KEYS.profile, data);
    },
  });
};
