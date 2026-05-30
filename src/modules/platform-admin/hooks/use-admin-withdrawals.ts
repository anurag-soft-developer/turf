"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminWithdrawalsApi } from "../api/withdrawals";
import { PLATFORM_ADMIN_QUERY_KEYS } from "../constants/query-keys";
import type {
  AddWithdrawalAttachmentsPayload,
  AddWithdrawalCommentPayload,
  UpdateWithdrawalStatusPayload,
  WithdrawalsFilter,
} from "@/types/withdrawal";

export function useAdminWithdrawals(params: WithdrawalsFilter = {}) {
  return useQuery({
    queryKey: PLATFORM_ADMIN_QUERY_KEYS.adminWithdrawals(params),
    queryFn: () => adminWithdrawalsApi.listAdminRequests(params),
  });
}

export function useAdminWithdrawal(id: string) {
  return useQuery({
    queryKey: PLATFORM_ADMIN_QUERY_KEYS.adminWithdrawal(id),
    queryFn: () => adminWithdrawalsApi.getById(id),
    enabled: Boolean(id),
  });
}

export function useUpdateWithdrawalStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateWithdrawalStatusPayload;
    }) => adminWithdrawalsApi.updateStatus(id, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({
        queryKey: ["platform-admin", "withdrawals"],
      });
      queryClient.invalidateQueries({
        queryKey: PLATFORM_ADMIN_QUERY_KEYS.adminWithdrawal(id),
      });
    },
  });
}

export function useAddWithdrawalComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: AddWithdrawalCommentPayload;
    }) => adminWithdrawalsApi.addComment(id, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({
        queryKey: PLATFORM_ADMIN_QUERY_KEYS.adminWithdrawal(id),
      });
    },
  });
}

export function useAddWithdrawalAttachments() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: AddWithdrawalAttachmentsPayload;
    }) => adminWithdrawalsApi.addAttachments(id, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({
        queryKey: PLATFORM_ADMIN_QUERY_KEYS.adminWithdrawal(id),
      });
    },
  });
}
