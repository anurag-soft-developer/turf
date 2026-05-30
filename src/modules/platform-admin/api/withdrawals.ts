import api from "@/lib/api/client";
import { API_CONFIG } from "@/lib/constants/api";
import type { PaginatedResponse } from "@/types/common";
import type {
  AddWithdrawalAttachmentsPayload,
  AddWithdrawalCommentPayload,
  UpdateWithdrawalStatusPayload,
  Withdrawal,
  WithdrawalsFilter,
} from "@/types/withdrawal";

export const adminWithdrawalsApi = {
  listAdminRequests: async (
    params: WithdrawalsFilter = {},
  ): Promise<PaginatedResponse<Withdrawal>> => {
    const response = await api.get<PaginatedResponse<Withdrawal>>(
      API_CONFIG.ENDPOINTS.WITHDRAWALS.ADMIN_REQUESTS,
      { params },
    );
    return response.data;
  },

  getById: async (id: string): Promise<Withdrawal> => {
    const response = await api.get<Withdrawal>(
      API_CONFIG.ENDPOINTS.WITHDRAWALS.BY_ID(id),
    );
    return response.data;
  },

  updateStatus: async (
    id: string,
    payload: UpdateWithdrawalStatusPayload,
  ): Promise<Withdrawal> => {
    const response = await api.patch<Withdrawal>(
      API_CONFIG.ENDPOINTS.WITHDRAWALS.ADMIN_STATUS(id),
      payload,
    );
    return response.data;
  },

  addComment: async (
    id: string,
    payload: AddWithdrawalCommentPayload,
  ): Promise<Withdrawal> => {
    const response = await api.post<Withdrawal>(
      API_CONFIG.ENDPOINTS.WITHDRAWALS.COMMENTS(id),
      payload,
    );
    return response.data;
  },

  addAttachments: async (
    id: string,
    payload: AddWithdrawalAttachmentsPayload,
  ): Promise<Withdrawal> => {
    const response = await api.post<Withdrawal>(
      API_CONFIG.ENDPOINTS.WITHDRAWALS.ATTACHMENTS(id),
      payload,
    );
    return response.data;
  },
};
