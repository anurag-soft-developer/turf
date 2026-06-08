import api from "@/lib/api/client";
import { API_CONFIG } from "@/lib/constants/api";
import type { PaginatedResponse } from "@/types/common";
import type { HostEvent, ReviewEventPayload } from "@/modules/host/types/event";

export interface PendingEventsParams {
  page?: number;
  limit?: number;
  globalSearchText?: string;
}

export const adminEventApprovalApi = {
  listPending: async (
    params: PendingEventsParams = {},
  ): Promise<PaginatedResponse<HostEvent>> => {
    const response = await api.get<PaginatedResponse<HostEvent>>(
      API_CONFIG.ENDPOINTS.EVENTS.ADMIN_PENDING,
      { params },
    );
    return response.data;
  },

  getById: async (id: string): Promise<HostEvent> => {
    const response = await api.get<HostEvent>(
      API_CONFIG.ENDPOINTS.EVENTS.BY_ID(id),
    );
    return response.data;
  },

  review: async (id: string, payload: ReviewEventPayload): Promise<HostEvent> => {
    const response = await api.patch<HostEvent>(
      API_CONFIG.ENDPOINTS.EVENTS.ADMIN_REVIEW(id),
      payload,
    );
    return response.data;
  },
};
