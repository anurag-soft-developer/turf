"use client";

import { AUTH_QUERY_KEYS, useProfile } from "@/lib/hooks/auth";
import type { User } from "@/types/auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { hostOnboardingApi } from "../api/onboarding";
import type { ApplyHostOnboardingPayload } from "../types/host-onboarding";
import { defaultHostOnboardingStatus } from "../types/host-onboarding";

/** Host payout/KYC status from the authenticated user profile (no extra request). */
export function useHostOnboardingStatus() {
  const query = useProfile();
  const data = query.data?.hostOnboarding ?? defaultHostOnboardingStatus();

  return {
    ...query,
    data,
  };
}

export function useApplyHostOnboarding() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ApplyHostOnboardingPayload) =>
      hostOnboardingApi.apply(payload),
    onSuccess: (hostOnboarding) => {
      queryClient.setQueryData<User | undefined>(
        AUTH_QUERY_KEYS.profile,
        (prev) => (prev ? { ...prev, hostOnboarding } : prev),
      );
    },
  });
}
