import api from "@/lib/api/client";
import { API_CONFIG } from "@/lib/constants/api";
import type { HostEvent } from "@/types/event";
import type { NearbyLocationQuery, PaginatedResponse } from "@/types/common";

export interface PublicEventsParams {
  page?: number;
  limit?: number;
  globalSearchText?: string;
  city?: string;
  startDate?: string;
  endDate?: string;
  minPrice?: number;
  maxPrice?: number;
  registrationsPaused?: boolean;
  location?: NearbyLocationQuery;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

function toQueryParams(
  params: PublicEventsParams,
): Record<string, string | number | boolean> {
  const query: Record<string, string | number | boolean> = {};

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined) continue;

    if (key === "location" && value && typeof value === "object") {
      const location = value as NearbyLocationQuery;
      query["location[nearbyLat]"] = location.nearbyLat;
      query["location[nearbyLng]"] = location.nearbyLng;
      if (location.nearbyRadiusKm != null) {
        query["location[nearbyRadiusKm]"] = location.nearbyRadiusKm;
      }
      continue;
    }

    query[key] = value as string | number | boolean;
  }

  return query;
}

export const publicEventsApi = {
  getEvents: async (
    params: PublicEventsParams = {},
  ): Promise<PaginatedResponse<HostEvent>> => {
    const response = await api.get<PaginatedResponse<HostEvent>>(
      API_CONFIG.ENDPOINTS.EVENTS.PUBLIC,
      { params: toQueryParams(params) },
    );
    return response.data;
  },

  getEventBySlug: async (slug: string): Promise<HostEvent> => {
    const response = await api.get<HostEvent>(
      API_CONFIG.ENDPOINTS.EVENTS.PUBLIC_BY_SLUG(slug),
    );
    return response.data;
  },
};
