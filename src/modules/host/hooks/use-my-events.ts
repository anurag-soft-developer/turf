"use client";

import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { getNextPageParamFromPaginated } from "@/lib/query/paginated-infinite";
import { hostEventApi, type MyEventsParams } from "../api/events";
import { HOST_QUERY_KEYS } from "../constants/query-keys";

const DEFAULT_EVENTS_LIMIT = 20;

export function useInfiniteMyEvents(params: Omit<MyEventsParams, "page"> = {}) {
  const limit = params.limit ?? DEFAULT_EVENTS_LIMIT;
  const filters = { ...params, limit };

  return useInfiniteQuery({
    queryKey: HOST_QUERY_KEYS.myEvents(filters),
    queryFn: ({ pageParam }) =>
      hostEventApi.getMyEvents({ ...filters, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: getNextPageParamFromPaginated,
  });
}

export function useHostEvent(id: string) {
  return useQuery({
    queryKey: HOST_QUERY_KEYS.event(id),
    queryFn: () => hostEventApi.getById(id),
    enabled: Boolean(id),
  });
}

export function useHostEventStats() {
  return useQuery({
    queryKey: HOST_QUERY_KEYS.eventStats,
    queryFn: () => hostEventApi.getMyStats(),
  });
}

export function useSearchMyEvents(
  searchText: string,
  options: { enabled?: boolean; limit?: number } = {},
) {
  const { enabled = true, limit = 8 } = options;
  const trimmed = searchText.trim();

  return useQuery({
    queryKey: HOST_QUERY_KEYS.myEvents({
      globalSearchText: trimmed || undefined,
      limit,
      sortOrder: "desc",
      page: 1,
    }),
    queryFn: () =>
      hostEventApi.getMyEvents({
        page: 1,
        limit,
        sortOrder: "desc",
        ...(trimmed ? { globalSearchText: trimmed } : {}),
      }),
    enabled,
  });
}
