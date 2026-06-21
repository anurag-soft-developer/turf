"use client";

import { useQuery } from "@tanstack/react-query";
import { eventBookingsApi } from "../api/bookings";
import { EVENT_BOOKINGS_QUERY_KEYS } from "../constants/query-keys";

export function useMyEventBooking(eventId: string, enabled = true) {
  return useQuery({
    queryKey: EVENT_BOOKINGS_QUERY_KEYS.myBooking(eventId),
    queryFn: () => eventBookingsApi.getMyBooking(eventId),
    enabled: Boolean(eventId) && enabled,
  });
}
