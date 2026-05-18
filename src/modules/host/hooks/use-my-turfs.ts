"use client";

import { useQuery } from "@tanstack/react-query";
import { hostTurfApi, type MyTurfsParams } from "../api/turf";
import { HOST_QUERY_KEYS } from "../constants/query-keys";

export function useMyTurfs(params: MyTurfsParams = {}) {
  return useQuery({
    queryKey: HOST_QUERY_KEYS.myTurfs(params),
    queryFn: () => hostTurfApi.getMyTurfs(params),
  });
}

export function useHostTurf(id: string) {
  return useQuery({
    queryKey: HOST_QUERY_KEYS.turf(id),
    queryFn: () => hostTurfApi.getById(id),
    enabled: Boolean(id),
  });
}

export function useTurfStats() {
  return useQuery({
    queryKey: HOST_QUERY_KEYS.turfStats,
    queryFn: () => hostTurfApi.getStats(),
  });
}
