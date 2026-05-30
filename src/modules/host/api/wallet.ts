import api from "@/lib/api/client";
import { API_CONFIG } from "@/lib/constants/api";
import type { UpdatePayoutDetailsPayload, Wallet } from "@/types/wallet";

export const hostWalletApi = {
  getMyWallet: async (): Promise<Wallet> => {
    const response = await api.get<Wallet>(API_CONFIG.ENDPOINTS.WALLET.ME);
    return response.data;
  },

  updatePayoutDetails: async (
    payload: UpdatePayoutDetailsPayload,
  ): Promise<Wallet> => {
    const response = await api.patch<Wallet>(
      API_CONFIG.ENDPOINTS.WALLET.PAYOUT_DETAILS,
      payload,
    );
    return response.data;
  },
};
