import api from "@/lib/api/client";
import { API_CONFIG } from "@/lib/constants/api";
import type {
  ApplyHostOnboardingPayload,
  HostOnboardingStatus,
} from "../types/host-onboarding";

export const hostOnboardingApi = {
  apply: async (
    payload: ApplyHostOnboardingPayload,
  ): Promise<HostOnboardingStatus> => {
    const response = await api.post<HostOnboardingStatus>(
      API_CONFIG.ENDPOINTS.USERS.HOST_ONBOARDING_APPLY,
      payload,
    );
    return response.data;
  },
};
