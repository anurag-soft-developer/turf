import ENV_CONFIG from "@/config/env.config";

export const API_CONFIG = {
  BASE_URL: ENV_CONFIG.API_BASE_URL,
  ENDPOINTS: {
    AUTH: {
      REGISTER: "/auth/register",
      LOGIN: "/auth/login",
      LOGOUT: "/auth/logout",
      REFRESH: "/auth/refresh",
      GOOGLE: "/auth/google",
      PROFILE: "/auth/profile",
      CHANGE_PASSWORD: "/auth/change-password",
      FORGOT_PASSWORD: "/auth/forgot-password",
      RESET_PASSWORD: "/auth/reset-password",
      VERIFY_EMAIL: "/auth/verify-email",
      SEND_VERIFICATION: "/auth/send-verification-email",
    },
    TURFS: {
      LIST: "/turfs",
      DETAILS: "/turfs",
      SEARCH: "/turfs/search",
      NEARBY: "/turfs/nearby",
    },
    BOOKINGS: {
      CREATE: "/bookings",
      LIST: "/bookings",
      DETAILS: "/bookings",
      CANCEL: "/bookings",
    },
    SPORTS: {
      LIST: "/sports",
    },
    REVIEWS: {
      CREATE: "/reviews",
      LIST: "/reviews",
    },
    EVENTS: {
      CREATE: "/events",
      LIST: "/events",
      DETAILS: "/events",
      REGISTER: "/events",
    },
  },
} as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
} as const;
