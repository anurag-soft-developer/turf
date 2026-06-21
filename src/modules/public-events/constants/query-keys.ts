export const PUBLIC_EVENTS_QUERY_KEYS = {
  events: (params?: object) => ["public", "events", params] as const,
  event: (slug: string) => ["public", "events", slug] as const,
} as const;
