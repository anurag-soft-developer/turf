import api from "@/lib/api/client";
import { API_CONFIG } from "@/lib/constants/api";
import type { PaginatedResponse } from "@/types/common";
import type {
  CreateWithdrawalPayload,
  Withdrawal,
  WithdrawalsFilter,
} from "@/types/withdrawal";

export const hostWithdrawalsApi = {
  createRequest: async (
    payload: CreateWithdrawalPayload,
  ): Promise<Withdrawal> => {
    const response = await api.post<Withdrawal>(
      API_CONFIG.ENDPOINTS.WITHDRAWALS.REQUEST,
      payload,
    );
    return response.data;
  },

  listMyRequests: async (
    params: WithdrawalsFilter = {},
  ): Promise<PaginatedResponse<Withdrawal>> => {
    const response = await api.get<PaginatedResponse<Withdrawal>>(
      API_CONFIG.ENDPOINTS.WITHDRAWALS.MY_REQUESTS,
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

  cancelRequest: async (id: string): Promise<Withdrawal> => {
    const response = await api.post<Withdrawal>(
      API_CONFIG.ENDPOINTS.WITHDRAWALS.CANCEL(id),
    );
    return response.data;
  },
};
