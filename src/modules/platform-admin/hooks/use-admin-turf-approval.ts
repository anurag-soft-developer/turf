"use client";

import { toastError } from "@/lib/toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  adminTurfApprovalApi,
  type PendingTurfsParams,
} from "../api/turf-approval";
import { PLATFORM_ADMIN_QUERY_KEYS } from "../constants/query-keys";
import type { ReviewTurfPayload } from "@/types/turf";

export function useAdminPendingTurfs(params: PendingTurfsParams = {}) {
  return useQuery({
    queryKey: PLATFORM_ADMIN_QUERY_KEYS.adminPendingTurfs(params),
    queryFn: () => adminTurfApprovalApi.listPending(params),
  });
}

export function useAdminTurf(id: string) {
  return useQuery({
    queryKey: PLATFORM_ADMIN_QUERY_KEYS.adminTurf(id),
    queryFn: () => adminTurfApprovalApi.getById(id),
    enabled: Boolean(id),
  });
}

export function useReviewTurf() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: ReviewTurfPayload;
    }) => adminTurfApprovalApi.review(id, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({
        queryKey: ["platform-admin", "pending-turfs"],
      });
      queryClient.invalidateQueries({
        queryKey: PLATFORM_ADMIN_QUERY_KEYS.adminTurf(id),
      });
    },
    onError: (error) =>
      toastError(error, "Failed to review turf. Please try again."),
  });
}
