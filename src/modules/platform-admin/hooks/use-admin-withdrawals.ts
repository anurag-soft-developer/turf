"use client";

import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { getNextPageParamFromPaginated } from "@/lib/query/paginated-infinite";
import { adminWithdrawalsApi } from "../api/withdrawals";
import { PLATFORM_ADMIN_QUERY_KEYS } from "../constants/query-keys";
import type {
  AddWithdrawalAttachmentsPayload,
  AddWithdrawalCommentPayload,
  UpdateWithdrawalStatusPayload,
  WithdrawalsFilter,
} from "@/types/withdrawal";

const DEFAULT_WITHDRAWALS_LIMIT = 20;

export function useInfiniteAdminWithdrawals(
  params: Omit<WithdrawalsFilter, "page"> = {},
) {
  const limit = params.limit ?? DEFAULT_WITHDRAWALS_LIMIT;
  const filters = { ...params, limit };

  return useInfiniteQuery({
    queryKey: PLATFORM_ADMIN_QUERY_KEYS.adminWithdrawals(filters),
    queryFn: ({ pageParam }) =>
      adminWithdrawalsApi.listAdminRequests({ ...filters, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: getNextPageParamFromPaginated,
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
