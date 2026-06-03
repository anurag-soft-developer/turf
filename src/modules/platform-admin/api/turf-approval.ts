import api from "@/lib/api/client";
import { API_CONFIG } from "@/lib/constants/api";
import type { Turf } from "@/modules/host/types/turf";
import type { PaginatedResponse } from "@/types/common";
import type { ReviewTurfPayload } from "@/types/turf";

export interface PendingTurfsParams {
  page?: number;
  limit?: number;
  globalSearchText?: string;
}

export const adminTurfApprovalApi = {
  listPending: async (
    params: PendingTurfsParams = {},
  ): Promise<PaginatedResponse<Turf>> => {
    const response = await api.get<PaginatedResponse<Turf>>(
      API_CONFIG.ENDPOINTS.TURF.ADMIN_PENDING,
      { params },
    );
    return response.data;
  },

  getById: async (id: string): Promise<Turf> => {
    const response = await api.get<Turf>(
      API_CONFIG.ENDPOINTS.TURF.BY_ID(id),
    );
    return response.data;
  },

  review: async (id: string, payload: ReviewTurfPayload): Promise<Turf> => {
    const response = await api.patch<Turf>(
      API_CONFIG.ENDPOINTS.TURF.ADMIN_REVIEW(id),
      payload,
    );
    return response.data;
  },
};
