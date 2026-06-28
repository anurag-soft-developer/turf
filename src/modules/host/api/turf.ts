import api from "@/lib/api/client";
import { API_CONFIG } from "@/lib/constants/api";
import type { PaginatedResponse } from "../../../types/common";
import type {
  CreateTurfPayload,
  Turf,
  TurfStats,
  UpdateTurfPayload,
} from "../types/turf";
import type { TurfStatus } from "@/types/turf";

export interface MyTurfsParams {
  page?: number;
  limit?: number;
  globalSearchText?: string;
  status?: TurfStatus;
  isAvailable?: boolean;
}

export const hostTurfApi = {
  getMyTurfs: async (
    params: MyTurfsParams = {},
  ): Promise<PaginatedResponse<Turf>> => {
    const response = await api.get<PaginatedResponse<Turf>>(
      API_CONFIG.ENDPOINTS.TURF.OWNER_MY,
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

  getStats: async (): Promise<TurfStats> => {
    const response = await api.get<TurfStats>(
      API_CONFIG.ENDPOINTS.TURF.STATS,
    );
    return response.data;
  },

  create: async (payload: CreateTurfPayload): Promise<Turf> => {
    const response = await api.post<Turf>(
      API_CONFIG.ENDPOINTS.TURF.BASE,
      payload,
    );
    return response.data;
  },

  update: async (id: string, payload: UpdateTurfPayload): Promise<Turf> => {
    const response = await api.patch<Turf>(
      API_CONFIG.ENDPOINTS.TURF.BY_ID(id),
      payload,
    );
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(API_CONFIG.ENDPOINTS.TURF.BY_ID(id));
  },

  submitForApproval: async (id: string): Promise<Turf> => {
    const response = await api.post<Turf>(
      API_CONFIG.ENDPOINTS.TURF.SUBMIT(id),
    );
    return response.data;
  },

  withdrawSubmission: async (id: string): Promise<Turf> => {
    const response = await api.post<Turf>(
      API_CONFIG.ENDPOINTS.TURF.WITHDRAW(id),
    );
    return response.data;
  },
};
