"use client";

import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { getNextPageParamFromPaginated } from "@/lib/query/paginated-infinite";
import { hostTurfApi, type MyTurfsParams } from "../api/turf";
import { HOST_QUERY_KEYS } from "../constants/query-keys";

const DEFAULT_TURFS_LIMIT = 20;

export function useInfiniteMyTurfs(params: Omit<MyTurfsParams, "page"> = {}) {
  const limit = params.limit ?? DEFAULT_TURFS_LIMIT;
  const filters = { ...params, limit };

  return useInfiniteQuery({
    queryKey: HOST_QUERY_KEYS.myTurfs(filters),
    queryFn: ({ pageParam }) =>
      hostTurfApi.getMyTurfs({ ...filters, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: getNextPageParamFromPaginated,
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

export function useSearchMyTurfs(
  searchText: string,
  options: { enabled?: boolean; limit?: number } = {},
) {
  const { enabled = true, limit = 8 } = options;
  const trimmed = searchText.trim();

  return useQuery({
    queryKey: HOST_QUERY_KEYS.myTurfs({
      globalSearchText: trimmed || undefined,
      limit,
      page: 1,
    }),
    queryFn: () =>
      hostTurfApi.getMyTurfs({
        page: 1,
        limit,
        ...(trimmed ? { globalSearchText: trimmed } : {}),
      }),
    enabled,
  });
}
