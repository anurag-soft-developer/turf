import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { API_CONFIG } from "@/lib/constants/api";
import { ROUTE_POINT } from "@/lib/constants/route-point";
import { getAuthToken } from "@/lib/utils/auth.util";
import { clearSession, refreshAccessToken } from "./refresh-session";
import { StatusCodes } from "http-status-codes";

const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

const AUTH_PATHS_WITHOUT_REFRESH = [
  API_CONFIG.ENDPOINTS.AUTH.LOGIN,
  API_CONFIG.ENDPOINTS.AUTH.LOGIN_VERIFY_OTP,
  API_CONFIG.ENDPOINTS.AUTH.REGISTER,
  API_CONFIG.ENDPOINTS.AUTH.REFRESH,
  API_CONFIG.ENDPOINTS.AUTH.FORGOT_PASSWORD,
  API_CONFIG.ENDPOINTS.AUTH.RESET_PASSWORD,
  API_CONFIG.ENDPOINTS.AUTH.VERIFY_EMAIL,
  API_CONFIG.ENDPOINTS.AUTH.SEND_VERIFICATION,
];

type RetryConfig = InternalAxiosRequestConfig & { _retry?: boolean };

let isRefreshing = false;
let refreshQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

function shouldSkipRefresh(url?: string) {
  if (!url) return true;
  return AUTH_PATHS_WITHOUT_REFRESH.some((path) => url.includes(path));
}

function processRefreshQueue(error: unknown | null, token: string | null) {
  refreshQueue.forEach(({ resolve, reject }) => {
    if (error || !token) {
      reject(error ?? new Error("Token refresh failed"));
    } else {
      resolve(token);
    }
  });
  refreshQueue = [];
}

function redirectToLogin() {
  if (typeof window === "undefined") return;
  const isAuthPage = window.location.pathname.startsWith(ROUTE_POINT.auth.base);
  if (!isAuthPage) {
    window.location.href = ROUTE_POINT.auth.login;
  }
}

api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryConfig | undefined;

    if (
      !originalRequest ||
      error.response?.status !== StatusCodes.UNAUTHORIZED ||
      originalRequest._retry ||
      shouldSkipRefresh(originalRequest.url)
    ) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        refreshQueue.push({
          resolve: (token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(api(originalRequest));
          },
          reject,
        });
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const newToken = await refreshAccessToken();
      processRefreshQueue(null, newToken);
      originalRequest.headers.Authorization = `Bearer ${newToken}`;
      return api(originalRequest);
    } catch (refreshError) {
      processRefreshQueue(refreshError, null);
      clearSession();
      redirectToLogin();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

export default api;
