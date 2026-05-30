export const HOST_QUERY_KEYS = {
  myTurfs: (params?: object) => ["host", "turfs", params] as const,
  turf: (id: string) => ["host", "turf", id] as const,
  turfStats: ["host", "turf-stats"] as const,
  ownerBookings: (params?: object) => ["host", "owner-bookings", params] as const,
  ownerBooking: (id: string) => ["host", "owner-booking", id] as const,
  ownerBookingStats: (turfIds?: string[]) =>
    ["host", "owner-booking-stats", turfIds] as const,
  wallet: ["host", "wallet"] as const,
  myWithdrawals: (params?: object) => ["host", "my-withdrawals", params] as const,
  withdrawal: (id: string) => ["host", "withdrawal", id] as const,
} as const;
