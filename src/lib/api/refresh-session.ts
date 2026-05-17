import axios from "axios";
import { API_CONFIG } from "@/lib/constants/api";
import type { AuthResponse } from "@/types/auth";
import {
  getRefreshToken,
  removeAuthToken,
  removeRefreshToken,
  setAuthToken,
  setRefreshToken,
} from "@/lib/utils/auth.util";

/** Calls /auth/refresh without the main api client to avoid interceptor loops. */
export async function refreshAccessToken(): Promise<string> {
  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    throw new Error("No refresh token available");
  }

  const { data } = await axios.post<AuthResponse>(
    `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.REFRESH}`,
    { refreshToken },
    {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    },
  );

  setAuthToken(data.accessToken);
  setRefreshToken(data.refreshToken);

  return data.accessToken;
}

export function clearSession() {
  removeAuthToken();
  removeRefreshToken();
}
