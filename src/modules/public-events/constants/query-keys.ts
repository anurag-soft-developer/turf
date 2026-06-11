export const PUBLIC_EVENTS_QUERY_KEYS = {
  events: (params?: object) => ["public", "events", params] as const,
} as const;
