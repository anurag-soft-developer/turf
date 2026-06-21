export const ROUTE_POINT = {
  home: "/",
  catalog: "/catalog",
  reviews: "/reviews",
  events: "/events",
  myBookings: "/my-bookings",
  eventDetail: (slug: string) => `/events/${slug}`,
  paymentsRazorpayCallback: "/payments/razorpay/callback",
  notifications: "/notifications",
  settings: "/settings",
  auth: {
    base: "/auth",
    login: "/auth/login",
    loginWithRedirect: (returnTo: string) =>
      `/auth/login?redirect=${encodeURIComponent(returnTo)}`,
    register: "/auth/register",
    forgotPassword: "/auth/forgot-password",
    verifyEmail: "/auth/verify-email",
    callback: "/auth/callback",
  },
  host: {
    events: {
      dashboard: "/host/events",
      events: "/host/events/events",
      bookings: "/host/events/bookings",
      wallet: "/host/events/wallet",
    },
    turves: {
      dashboard: "/host/turves",
      list: "/host/turves/turves",
      bookings: "/host/turves/bookings",
      wallet: "/host/turves/wallet",
    },
  },
  platformAdmin: {
    home: "/platform-admin",
    turves: "/platform-admin/turves",
    events: "/platform-admin/events",
    withdrawals: "/platform-admin/withdrawals",
  },
} as const;

export type RoutePoint = typeof ROUTE_POINT;
