"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { hostTurfApi } from "../api/turf";
import { HOST_QUERY_KEYS } from "../constants/query-keys";
import type { CreateTurfPayload, UpdateTurfPayload } from "../types/turf";

export function useCreateTurf() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (payload: CreateTurfPayload) => hostTurfApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["host", "turfs"] });
      queryClient.invalidateQueries({ queryKey: HOST_QUERY_KEYS.turfStats });
      router.push("/host/turfs");
    },
  });
}

export function useUpdateTurf(id: string) {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (payload: UpdateTurfPayload) => hostTurfApi.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["host", "turfs"] });
      queryClient.invalidateQueries({ queryKey: HOST_QUERY_KEYS.turf(id) });
      router.push(`/host/turfs?drawer=${encodeURIComponent(id)}`);
    },
  });
}

export function useDeleteTurf() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (id: string) => hostTurfApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["host", "turfs"] });
      queryClient.invalidateQueries({ queryKey: HOST_QUERY_KEYS.turfStats });
      router.push("/host/turfs");
    },
  });
}
