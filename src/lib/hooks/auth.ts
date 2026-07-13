"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authApi } from "@/lib/api/auth";
import type {
  ChangePasswordFormData,
  ForgotPasswordPayload,
  LoginFormData,
  RegisterFormData,
  ResetPasswordPayload,
  UpdateNotificationSettingsFormData,
  UpdateProfileFormData,
  UpdateTwoFactorFormData,
  VerifyEmailFormData,
  VerifyLoginOtpPayload,
} from "@/lib/schemas/auth";
import {
  toLoginPayload,
  toRegisterPayload,
} from "@/lib/schemas/auth";
import { isAuthResponse } from "@/types/auth";
import { useRouter } from "next/navigation";
import {
  getAuthToken,
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

type AuthTokenState = "pending" | "absent" | "present";

function useAuthTokenState(): AuthTokenState {
  const [state, setState] = useState<AuthTokenState>("pending");

  useEffect(() => {
    setState(getAuthToken() ? "present" : "absent");
  }, []);

  return state;
}

function persistSession(accessToken: string, refreshToken: string) {
  setAuthToken(accessToken);
  setRefreshToken(refreshToken);
}

export const useLogin = (redirectTo?: string) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: LoginFormData) => authApi.login(toLoginPayload(data)),
    onSuccess: (data) => {
      if (!isAuthResponse(data)) return;

      queryClient.setQueryData(AUTH_QUERY_KEYS.profile, data.user);
      queryClient.setQueryData(AUTH_QUERY_KEYS.status, {
        isAuthenticated: true,
        user: data.user,
      });
      persistSession(data.accessToken, data.refreshToken);
      router.push(redirectTo || ROUTE_POINT.events);
      router.refresh();
    },
  });
};

export const useVerifyLoginOtp = (redirectTo?: string) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: VerifyLoginOtpPayload) => authApi.verifyLoginOtp(data),
    onSuccess: (data) => {
      queryClient.setQueryData(AUTH_QUERY_KEYS.profile, data.user);
      queryClient.setQueryData(AUTH_QUERY_KEYS.status, {
        isAuthenticated: true,
        user: data.user,
      });
      persistSession(data.accessToken, data.refreshToken);
      router.push(redirectTo || ROUTE_POINT.events);
      router.refresh();
    },
  });
};

export const useRegister = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: RegisterFormData) =>
      authApi.register(toRegisterPayload(data)),
    onSuccess: (data) => {
      queryClient.setQueryData(AUTH_QUERY_KEYS.profile, data.user);
      persistSession(data.accessToken, data.refreshToken);
      router.push(ROUTE_POINT.events);
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
  const tokenState = useAuthTokenState();

  const query = useQuery({
    queryKey: AUTH_QUERY_KEYS.profile,
    queryFn: authApi.getProfile,
    enabled: tokenState === "present",
    staleTime: 5 * 60 * 1000,
  });

  return {
    ...query,
    isLoading: tokenState === "pending" || query.isLoading,
  };
};

export const useAuthStatus = () => {
  const tokenState = useAuthTokenState();

  const query = useQuery({
    queryKey: AUTH_QUERY_KEYS.status,
    queryFn: authApi.getAuthStatus,
    enabled: tokenState === "present",
    staleTime: 5 * 60 * 1000,
  });

  const isAuthenticated =
    tokenState === "present" && Boolean(query.data?.isAuthenticated);

  return {
    ...query,
    isLoading: tokenState === "pending" || query.isLoading,
    isAuthenticated,
  };
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
    mutationFn: (data: ForgotPasswordPayload) => authApi.forgotPassword(data),
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: (data: ResetPasswordPayload) => authApi.resetPassword(data),
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
      router.push(ROUTE_POINT.events);
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
