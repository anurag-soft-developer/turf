"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { hostWithdrawalsApi } from "../api/withdrawals";
import { HOST_QUERY_KEYS } from "../constants/query-keys";
import type {
  CreateWithdrawalPayload,
  WithdrawalsFilter,
} from "@/types/withdrawal";

export function useMyWithdrawals(params: WithdrawalsFilter = {}) {
  return useQuery({
    queryKey: HOST_QUERY_KEYS.myWithdrawals(params),
    queryFn: () => hostWithdrawalsApi.listMyRequests(params),
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
