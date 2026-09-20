import api from "@/lib/api/client";
import { API_CONFIG } from "@/lib/constants/api";
import type { PaginatedResponse } from "@/types/common";
import type {
  AddSupportInternalNotePayload,
  AddSupportReplyPayload,
  SupportQueriesFilter,
  SupportQuery,
  UpdateSupportQueryStatusPayload,
} from "@/types/support";

export const adminSupportApi = {
  listAdminQueries: async (
    params: SupportQueriesFilter = {},
  ): Promise<PaginatedResponse<SupportQuery>> => {
    const response = await api.get<PaginatedResponse<SupportQuery>>(
      API_CONFIG.ENDPOINTS.SUPPORT.ADMIN_QUERIES,
      { params },
    );
    return response.data;
  },

  getById: async (id: string): Promise<SupportQuery> => {
    const response = await api.get<SupportQuery>(
      API_CONFIG.ENDPOINTS.SUPPORT.BY_ID(id),
    );
    return response.data;
  },

  addReply: async (
    id: string,
    payload: AddSupportReplyPayload,
  ): Promise<SupportQuery> => {
    const response = await api.post<SupportQuery>(
      API_CONFIG.ENDPOINTS.SUPPORT.REPLIES(id),
      payload,
    );
    return response.data;
  },

  addInternalNote: async (
    id: string,
    payload: AddSupportInternalNotePayload,
  ): Promise<SupportQuery> => {
    const response = await api.post<SupportQuery>(
      API_CONFIG.ENDPOINTS.SUPPORT.INTERNAL_NOTES(id),
      payload,
    );
    return response.data;
  },

  updateStatus: async (
    id: string,
    payload: UpdateSupportQueryStatusPayload,
  ): Promise<SupportQuery> => {
    const response = await api.patch<SupportQuery>(
      API_CONFIG.ENDPOINTS.SUPPORT.ADMIN_STATUS(id),
      payload,
    );
    return response.data;
  },
};
