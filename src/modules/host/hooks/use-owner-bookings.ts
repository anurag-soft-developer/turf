"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { hostBookingsApi } from "../api/bookings";
import { HOST_QUERY_KEYS } from "../constants/query-keys";
import type { OwnerBookingsFilter } from "../types/owner-booking";

export function useOwnerBookings(params: OwnerBookingsFilter = {}) {
  return useQuery({
    queryKey: HOST_QUERY_KEYS.ownerBookings(params),
    queryFn: () => hostBookingsApi.getOwnerBookings(params),
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
