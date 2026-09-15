/** Key tuples keep the "host" prefix so React Query cache identity is unchanged. */
export const TURF_HOST_QUERY_KEYS = {
  myTurfs: (params?: object) => ["host", "turfs", params] as const,
  turf: (id: string) => ["host", "turf", id] as const,
  turfStats: ["host", "turf-stats"] as const,
  ownerBookings: (params?: object) => ["host", "owner-bookings", params] as const,
  ownerBooking: (id: string) => ["host", "owner-booking", id] as const,
  ownerBookingStats: (turfIds?: string[]) =>
    ["host", "owner-booking-stats", turfIds] as const,
} as const;
