"use client";

import { useQuery } from "@tanstack/react-query";
import { hostBookingsApi } from "../api/bookings";
import { TURF_HOST_QUERY_KEYS } from "../constants/query-keys";

export function useOwnerBookingStats(turfIds?: string[]) {
  return useQuery({
    queryKey: TURF_HOST_QUERY_KEYS.ownerBookingStats(turfIds),
    queryFn: () => hostBookingsApi.getOwnerStats(turfIds),
  });
}
