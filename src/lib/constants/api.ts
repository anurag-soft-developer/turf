import ENV_CONFIG from "@/config/env.config";

export const API_CONFIG = {
  BASE_URL: ENV_CONFIG.API_BASE_URL,
  ENDPOINTS: {
    AUTH: {
      REGISTER: "/auth/register",
      LOGIN: "/auth/login",
      LOGIN_VERIFY_OTP: "/auth/login/verify-otp",
      LOGOUT: "/auth/logout",
      REFRESH: "/auth/refresh",
      STATUS: "/auth/status",
      GOOGLE: "/auth/google",
      CHANGE_PASSWORD: "/auth/change-password",
      CHANGE_PASSWORD_SEND_OTP: "/auth/change-password/send-otp",
      TWO_FACTOR_SEND_OTP: "/auth/2fa-setting/send-otp",
      TWO_FACTOR_SETTING: "/auth/2fa-setting",
      FORGOT_PASSWORD: "/auth/forgot-password",
      RESET_PASSWORD: "/auth/reset-password",
      VERIFY_EMAIL: "/auth/verify-email",
      SEND_VERIFICATION: "/auth/send-verification-email",
    },
    USERS: {
      PROFILE: "/users/profile",
      NOTIFICATION_SETTINGS: "/users/notification-settings",
    },
  },
} as const;

