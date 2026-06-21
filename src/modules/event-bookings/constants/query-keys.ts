export const EVENT_BOOKINGS_QUERY_KEYS = {
  myBooking: (eventId: string) => ["event-bookings", "me", eventId] as const,
  myBookings: (params?: object) => ["event-bookings", "my", params] as const,
} as const;
