"use client";

import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { getNextPageParamFromPaginated } from "@/lib/query/paginated-infinite";
import { hostWithdrawalsApi } from "../api/withdrawals";
import { HOST_QUERY_KEYS } from "../constants/query-keys";
import type {
  CreateWithdrawalPayload,
  WithdrawalsFilter,
} from "@/types/withdrawal";

const DEFAULT_WITHDRAWALS_LIMIT = 1;

export function useInfiniteMyWithdrawals(
  params: Omit<WithdrawalsFilter, "page"> = {},
) {
  const limit = params.limit ?? DEFAULT_WITHDRAWALS_LIMIT;
  const filters = { ...params, limit };

  return useInfiniteQuery({
    queryKey: HOST_QUERY_KEYS.myWithdrawals(filters),
    queryFn: ({ pageParam }) =>
      hostWithdrawalsApi.listMyRequests({ ...filters, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: getNextPageParamFromPaginated,
  });
}

export function useWithdrawal(id: string) {
  return useQuery({
    queryKey: HOST_QUERY_KEYS.withdrawal(id),
    queryFn: () => hostWithdrawalsApi.getById(id),
    enabled: Boolean(id),
  });
}

export function useCreateWithdrawal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateWithdrawalPayload) =>
      hostWithdrawalsApi.createRequest(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: HOST_QUERY_KEYS.wallet });
      queryClient.invalidateQueries({ queryKey: ["host", "my-withdrawals"] });
    },
  });
}

export function useCancelWithdrawal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => hostWithdrawalsApi.cancelRequest(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: HOST_QUERY_KEYS.wallet });
      queryClient.invalidateQueries({ queryKey: ["host", "my-withdrawals"] });
      queryClient.invalidateQueries({
        queryKey: HOST_QUERY_KEYS.withdrawal(id),
      });
    },
  });
}
