"use client";

import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { getNextPageParamFromPaginated } from "@/lib/query/paginated-infinite";
import { hostBookingsApi } from "../api/bookings";
import { HOST_QUERY_KEYS } from "../constants/query-keys";
import type { OwnerBookingsFilter } from "../types/owner-booking";

const DEFAULT_BOOKINGS_LIMIT = 20;

export function useInfiniteOwnerBookings(
  params: Omit<OwnerBookingsFilter, "page"> = {},
) {
  const limit = params.limit ?? DEFAULT_BOOKINGS_LIMIT;
  const filters = { ...params, limit };

  return useInfiniteQuery({
    queryKey: HOST_QUERY_KEYS.ownerBookings(filters),
    queryFn: ({ pageParam }) =>
      hostBookingsApi.getOwnerBookings({ ...filters, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: getNextPageParamFromPaginated,
  });
}

export function useOwnerBooking(id: string) {
  return useQuery({
    queryKey: HOST_QUERY_KEYS.ownerBooking(id),
    queryFn: () => hostBookingsApi.getById(id),
    enabled: Boolean(id),
  });
}

export function useConfirmBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => hostBookingsApi.confirm(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["host", "owner-bookings"] });
      queryClient.invalidateQueries({
        queryKey: HOST_QUERY_KEYS.ownerBooking(id),
      });
      queryClient.invalidateQueries({
        queryKey: HOST_QUERY_KEYS.ownerBookingStats(),
      });
    },
  });
}

export function useCompleteBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => hostBookingsApi.complete(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["host", "owner-bookings"] });
      queryClient.invalidateQueries({
        queryKey: HOST_QUERY_KEYS.ownerBooking(id),
      });
      queryClient.invalidateQueries({
        queryKey: HOST_QUERY_KEYS.ownerBookingStats(),
      });
    },
  });
}

export function useCancelBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      hostBookingsApi.cancel(id, reason),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["host", "owner-bookings"] });
      queryClient.invalidateQueries({
        queryKey: HOST_QUERY_KEYS.ownerBooking(id),
      });
      queryClient.invalidateQueries({
        queryKey: HOST_QUERY_KEYS.ownerBookingStats(),
      });
    },
  });
}

export function useCheckInBooking() {
  return useCompleteBooking();
}
