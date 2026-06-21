"use client";

import { useQuery } from "@tanstack/react-query";
import { publicEventsApi } from "../api/events";
import { PUBLIC_EVENTS_QUERY_KEYS } from "../constants/query-keys";

export function usePublicEvent(slug: string) {
  return useQuery({
    queryKey: PUBLIC_EVENTS_QUERY_KEYS.event(slug),
    queryFn: () => publicEventsApi.getEventBySlug(slug),
    enabled: Boolean(slug),
  });
}
