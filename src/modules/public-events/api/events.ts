import api from "@/lib/api/client";
import { API_CONFIG } from "@/lib/constants/api";
import type { HostEvent } from "@/modules/host/types/event";
import type { PaginatedResponse } from "@/types/common";

export interface PublicEventsParams {
  page?: number;
  limit?: number;
  globalSearchText?: string;
  city?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

function toQueryParams(params: PublicEventsParams): Record<string, string | number> {
  const query: Record<string, string | number> = {};

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) {
      query[key] = value;
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

  getEventBySlug: async (slug: string): Promise<HostEvent> => {
    const response = await api.get<HostEvent>(
      API_CONFIG.ENDPOINTS.EVENTS.PUBLIC_BY_SLUG(slug),
    );
    return response.data;
  },
};
