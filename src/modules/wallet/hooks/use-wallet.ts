"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { hostWalletApi } from "../api/wallet";
import { WALLET_QUERY_KEYS } from "../constants/query-keys";
import type { UpdatePayoutDetailsPayload } from "@/types/wallet";

export function useWallet() {
  return useQuery({
    queryKey: WALLET_QUERY_KEYS.wallet,
    queryFn: hostWalletApi.getMyWallet,
  });
}

export function useUpdatePayoutDetails() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdatePayoutDetailsPayload) =>
      hostWalletApi.updatePayoutDetails(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WALLET_QUERY_KEYS.wallet });
    },
  });
}
