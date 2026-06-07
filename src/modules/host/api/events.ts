import api from "@/lib/api/client";
import { API_CONFIG } from "@/lib/constants/api";
import type { PaginatedResponse } from "@/types/common";
import type {
  CreateEventPayload,
  HostEvent,
  HostEventStats,
  UpdateEventPayload,
} from "../types/event";

export interface MyEventsParams {
  page?: number;
  limit?: number;
  globalSearchText?: string;
  status?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export const hostEventApi = {
  getMyEvents: async (
    params: MyEventsParams = {},
  ): Promise<PaginatedResponse<HostEvent>> => {
    const response = await api.get<PaginatedResponse<HostEvent>>(
      API_CONFIG.ENDPOINTS.EVENTS.MINE,
      { params },
    );
    return response.data;
  },

  getMyStats: async (): Promise<HostEventStats> => {
    const response = await api.get<HostEventStats>(
      API_CONFIG.ENDPOINTS.EVENTS.MINE_STATS,
    );
    return response.data;
  },

  getById: async (id: string): Promise<HostEvent> => {
    const response = await api.get<HostEvent>(API_CONFIG.ENDPOINTS.EVENTS.BY_ID(id));
    return response.data;
  },

  create: async (payload: CreateEventPayload): Promise<HostEvent> => {
    const response = await api.post<HostEvent>(
      API_CONFIG.ENDPOINTS.EVENTS.BASE,
      payload,
    );
    return response.data;
  },

  update: async (id: string, payload: UpdateEventPayload): Promise<HostEvent> => {
    const response = await api.patch<HostEvent>(
      API_CONFIG.ENDPOINTS.EVENTS.BY_ID(id),
      payload,
    );
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(API_CONFIG.ENDPOINTS.EVENTS.BY_ID(id));
  },

  submitForApproval: async (id: string): Promise<HostEvent> => {
    const response = await api.post<HostEvent>(
      API_CONFIG.ENDPOINTS.EVENTS.SUBMIT(id),
    );
    return response.data;
  },

  withdrawSubmission: async (id: string): Promise<HostEvent> => {
    const response = await api.post<HostEvent>(
      API_CONFIG.ENDPOINTS.EVENTS.WITHDRAW(id),
    );
    return response.data;
  },

  close: async (id: string): Promise<HostEvent> => {
    const response = await api.patch<HostEvent>(
      API_CONFIG.ENDPOINTS.EVENTS.CLOSE(id),
    );
    return response.data;
  },
};
