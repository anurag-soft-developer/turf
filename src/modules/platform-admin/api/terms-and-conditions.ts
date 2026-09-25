import api from "@/lib/api/client";
import { API_CONFIG } from "@/lib/constants/api";
import type {
  SaveTermsDraftPayload,
  TermsAndConditions,
  TermsAndConditionsKindType,
  UpdateTermsDraftPayload,
} from "@/types/terms-and-conditions";

export const adminTermsApi = {
  list: async (
    kind: TermsAndConditionsKindType,
  ): Promise<TermsAndConditions[]> => {
    const response = await api.get<TermsAndConditions[]>(
      API_CONFIG.ENDPOINTS.TERMS_AND_CONDITIONS.ADMIN,
      { params: { kind } },
    );
    return response.data;
  },

  createDraft: async (
    payload: SaveTermsDraftPayload,
  ): Promise<TermsAndConditions> => {
    const response = await api.post<TermsAndConditions>(
      API_CONFIG.ENDPOINTS.TERMS_AND_CONDITIONS.BASE,
      payload,
    );
    return response.data;
  },

  updateDraft: async (
    id: string,
    payload: UpdateTermsDraftPayload,
  ): Promise<TermsAndConditions> => {
    const response = await api.patch<TermsAndConditions>(
      API_CONFIG.ENDPOINTS.TERMS_AND_CONDITIONS.BY_ID(id),
      payload,
    );
    return response.data;
  },

  publish: async (id: string): Promise<TermsAndConditions> => {
    const response = await api.post<TermsAndConditions>(
      API_CONFIG.ENDPOINTS.TERMS_AND_CONDITIONS.PUBLISH(id),
    );
    return response.data;
  },
};
