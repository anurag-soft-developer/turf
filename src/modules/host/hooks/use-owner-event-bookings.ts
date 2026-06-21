"use client";

import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { getNextPageParamFromPaginated } from "@/lib/query/paginated-infinite";
import { hostEventBookingsApi } from "../api/event-bookings";
import { HOST_QUERY_KEYS } from "../constants/query-keys";
import type { OwnerEventBookingsFilter } from "../types/owner-event-booking";

const DEFAULT_BOOKINGS_LIMIT = 20;

export function useInfiniteOwnerEventBookings(
  params: Omit<OwnerEventBookingsFilter, "page"> = {},
) {
  const limit = params.limit ?? DEFAULT_BOOKINGS_LIMIT;
  const filters = { ...params, limit };

  return useInfiniteQuery({
    queryKey: HOST_QUERY_KEYS.ownerEventBookings(filters),
    queryFn: ({ pageParam }) =>
      hostEventBookingsApi.getOwnerBookings({ ...filters, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: getNextPageParamFromPaginated,
  });
}

export function useOwnerEventBooking(id: string) {
  return useQuery({
    queryKey: HOST_QUERY_KEYS.ownerEventBooking(id),
    queryFn: () => hostEventBookingsApi.getById(id),
    enabled: Boolean(id),
  });
}

export function useConfirmEventBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => hostEventBookingsApi.confirm(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({
        queryKey: ["host", "owner-event-bookings"],
      });
      queryClient.invalidateQueries({
        queryKey: HOST_QUERY_KEYS.ownerEventBooking(id),
      });
    },
  });
}

export function useCompleteEventBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => hostEventBookingsApi.complete(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({
        queryKey: ["host", "owner-event-bookings"],
      });
      queryClient.invalidateQueries({
        queryKey: HOST_QUERY_KEYS.ownerEventBooking(id),
      });
    },
  });
}

export function useCancelEventBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      hostEventBookingsApi.cancel(id, reason),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({
        queryKey: ["host", "owner-event-bookings"],
      });
      queryClient.invalidateQueries({
        queryKey: HOST_QUERY_KEYS.ownerEventBooking(id),
      });
    },
  });
}
