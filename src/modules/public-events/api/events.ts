import api from "@/lib/api/client";
import { API_CONFIG } from "@/lib/constants/api";
import type { HostEvent } from "@/modules/host/types/event";
import type { PaginatedResponse } from "@/types/common";

export interface PublicEventsLocationFilter {
  nearbyLat: number;
  nearbyLng: number;
  nearbyRadiusKm?: number;
}

export interface PublicEventsParams {
  page?: number;
  limit?: number;
  location?: PublicEventsLocationFilter;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

function toQueryParams(params: PublicEventsParams): Record<string, string | number> {
  const { location, ...rest } = params;
  const query: Record<string, string | number> = {};

  for (const [key, value] of Object.entries(rest)) {
    if (value !== undefined) {
      query[key] = value;
    }
  }

  if (location) {
    query["location[nearbyLat]"] = location.nearbyLat;
    query["location[nearbyLng]"] = location.nearbyLng;
    if (location.nearbyRadiusKm !== undefined) {
      query["location[nearbyRadiusKm]"] = location.nearbyRadiusKm;
    }
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
};
