"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { getNextPageParamFromPaginated } from "@/lib/query/paginated-infinite";
import { eventBookingsApi } from "../api/bookings";
import { EVENT_BOOKINGS_QUERY_KEYS } from "../constants/query-keys";
import type { MyEventBookingsFilter } from "../types/booking";

const DEFAULT_BOOKINGS_LIMIT = 20;

export function useInfiniteMyEventBookings(
  params: Omit<MyEventBookingsFilter, "page"> = {},
) {
  const limit = params.limit ?? DEFAULT_BOOKINGS_LIMIT;
  const filters = { ...params, limit };

  return useInfiniteQuery({
    queryKey: EVENT_BOOKINGS_QUERY_KEYS.myBookings(filters),
    queryFn: ({ pageParam }) =>
      eventBookingsApi.getMyBookings({ ...filters, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: getNextPageParamFromPaginated,
  });
}
