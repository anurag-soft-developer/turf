"use client";

import { useQuery } from "@tanstack/react-query";
import { publicEventsApi, type PublicEventsParams } from "../api/events";
import { PUBLIC_EVENTS_QUERY_KEYS } from "../constants/query-keys";

export function usePublicEvents(params: PublicEventsParams = {}) {
  return useQuery({
    queryKey: PUBLIC_EVENTS_QUERY_KEYS.events(params),
    queryFn: () => publicEventsApi.getEvents(params),
  });
}
