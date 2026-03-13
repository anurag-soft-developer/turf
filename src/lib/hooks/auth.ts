"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authApi } from "@/lib/api/auth";
import type { LoginFormData, RegisterFormData } from "@/lib/schemas/auth";
import { useRouter } from "next/navigation";
import { removeAuthToken, setAuthToken } from "../utils/auth.util";

export const AUTH_QUERY_KEYS = {
  profile: ["auth", "profile"],
  user: ["auth", "user"],
} as const;

export const useLogin = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: (data: LoginFormData) => authApi.login(data),
    onSuccess: (data) => {
      queryClient.setQueryData(AUTH_QUERY_KEYS.profile, data.user);
      setAuthToken(data.accessToken);
      router.push("/dashboard");
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
      setAuthToken(data.accessToken);
      router.push("/dashboard");
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
      router.push("/auth/login");
      router.refresh();
    },
  });
};

export const useProfile = () => {
  return useQuery({
    queryKey: AUTH_QUERY_KEYS.profile,
    queryFn: authApi.getProfile,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.updateProfile,
    onSuccess: (data) => {
      queryClient.setQueryData(AUTH_QUERY_KEYS.profile, data);
    },
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: authApi.changePassword,
  });
};

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: (email: string) => authApi.forgotPassword(email),
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: authApi.resetPassword,
  });
};

export const useVerifyEmail = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: (data: { otp: string; email: string }) =>
      authApi.verifyEmail(data),
    onSuccess: (data) => {
      // Update user profile in cache to reflect verified status
      queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEYS.profile });
      setAuthToken(data.accessToken);
      router.push("/dashboard");
      router.refresh();
    },
  });
};

export const useSendVerificationEmail = () => {
  return useMutation({
    mutationFn: (email: string) => authApi.sendVerificationEmail(email),
  });
};
