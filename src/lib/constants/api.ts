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
    TURF: {
      BASE: "/turf",
      OWNER_MY: "/turf/owner/my",
      STATS: "/turf/stats",
      BY_ID: (id: string) => `/turf/${id}`,
      SUBMIT: (id: string) => `/turf/${id}/submit`,
      WITHDRAW: (id: string) => `/turf/${id}/withdraw`,
      ADMIN_PENDING: "/turf/admin/pending",
      ADMIN_REVIEW: (id: string) => `/turf/admin/${id}/review`,
    },
    TURF_BOOKINGS: {
      OWNER_BOOKINGS: "/turf-bookings/owner-bookings",
      OWNER_STATS: "/turf-bookings/owner-bookings/stats",
      BY_ID: (id: string) => `/turf-bookings/${id}`,
    },
    EVENTS: {
      BASE: "/events",
      MINE: "/events/mine",
      MINE_STATS: "/events/mine/stats",
      PUBLIC: "/events/public",
      PUBLIC_BY_SLUG: (slug: string) => `/events/public/${slug}`,
      BY_ID: (id: string) => `/events/${id}`,
      SUBMIT: (id: string) => `/events/${id}/submit`,
      WITHDRAW: (id: string) => `/events/${id}/withdraw`,
      CLOSE: (id: string) => `/events/${id}/close`,
      ADMIN_PENDING: "/events/admin/pending",
      ADMIN_REVIEW: (id: string) => `/events/admin/${id}/review`,
    },
    EVENT_BOOKINGS: {
      USER_BOOKINGS: "/event-bookings/user-bookings",
      OWNER_BOOKINGS: "/event-bookings/owner-bookings",
      BY_ID: (id: string) => `/event-bookings/${id}`,
      CREATE_ORDER: (eventId: string) =>
        `/event-bookings/events/${eventId}/create-order`,
      VERIFY_HOSTED: (eventId: string) =>
        `/event-bookings/events/${eventId}/verify-hosted-payment`,
      ME: (eventId: string) => `/event-bookings/events/${eventId}/me`,
    },
    STORAGE: {
      UPLOAD_URL: "/storage/upload-url",
      OBJECTS: "/storage/objects",
    },
    WALLET: {
      ME: "/wallet/me",
      PAYOUT_DETAILS: "/wallet/payout-details",
    },
    WITHDRAWALS: {
      REQUEST: "/withdrawals/request",
      MY_REQUESTS: "/withdrawals/my-requests",
      BY_ID: (id: string) => `/withdrawals/${id}`,
      CANCEL: (id: string) => `/withdrawals/${id}/cancel`,
      ADMIN_REQUESTS: "/withdrawals/admin/requests",
      ADMIN_STATUS: (id: string) => `/withdrawals/admin/${id}/status`,
      COMMENTS: (id: string) => `/withdrawals/${id}/comments`,
      ATTACHMENTS: (id: string) => `/withdrawals/${id}/attachments`,
    },
  },
} as const;

