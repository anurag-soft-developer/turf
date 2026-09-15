/** Key tuples keep the "host" prefix so React Query cache identity is unchanged. */
export const EVENT_HOST_QUERY_KEYS = {
  myEvents: (params?: object) => ["host", "events", params] as const,
  event: (id: string) => ["host", "event", id] as const,
  eventStats: ["host", "event-stats"] as const,
  ownerEventBookings: (params?: object) =>
    ["host", "owner-event-bookings", params] as const,
  ownerEventBooking: (id: string) => ["host", "owner-event-booking", id] as const,
} as const;
