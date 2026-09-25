import ENV_CONFIG, { type AppType } from "@/config/env.config";
import { ROUTE_POINT } from "@/lib/constants/route-point";

export type AppNavLink = {
  label: string;
  href: string;
};

export type AppProfileLink = {
  href: string;
  label: string;
  icon: "CalendarCheck" | "BrickWall" | "Ticket";
};

export type AppFooterQuickLinks = {
  authenticated: AppNavLink[];
  anonymous: AppNavLink[];
};

export type AppManifest = {
  homeRoute: string;
  /** Paths that must match exactly (e.g. `/` and `/platform-admin`). */
  allowedExact: string[];
  /** Path prefixes; `/auth`, `/settings`, `/notifications` are always allowed separately. */
  allowedPrefixes: string[];
  navLinks: AppNavLink[];
  footerTagline: string;
  footerQuickLinks: AppFooterQuickLinks;
  profileLinks: AppProfileLink[];
  features: {
    turfHost: boolean;
    eventsPublic: boolean;
    eventsHost: boolean;
    platformAdmin: boolean;
  };
  metadata: {
    titleSuffix: string;
    description: string;
  };
};

export const APPS: Record<AppType, AppManifest> = {
  turfmanagement: {
    homeRoute: ROUTE_POINT.home,
    allowedExact: ["/", "/platform-admin"],
    allowedPrefixes: [
      "/host/turves",
      "/platform-admin/withdrawals",
      "/platform-admin/support",
      "/platform-admin/turves",
      "/platform-admin/terms-and-conditions",
    ],
    navLinks: [
      { label: "How it works", href: "/#how-it-works" },
      { label: "Features", href: "/#features" },
    ],
    footerTagline:
      "The host platform for turf owners. Publish your venue, manage bookings, and grow your sports business.",
    footerQuickLinks: {
      authenticated: [
        { href: ROUTE_POINT.host.turves.dashboard, label: "Dashboard" },
      ],
      anonymous: [
        { href: ROUTE_POINT.auth.register, label: "List Your Turf" },
      ],
    },
    profileLinks: [
      {
        href: ROUTE_POINT.host.turves.dashboard,
        label: "Turf management",
        icon: "BrickWall",
      },
    ],
    features: {
      turfHost: true,
      eventsPublic: false,
      eventsHost: false,
      platformAdmin: true,
    },
    metadata: {
      titleSuffix: "List Your Turf & Take Bookings",
      description:
        "Publish your sports turf, manage bookings, and grow your venue business. Built for turf owners.",
    },
  },
  events: {
    homeRoute: ROUTE_POINT.events,
    allowedExact: [],
    allowedPrefixes: ["/events", "/my-bookings", "/payments"],
    navLinks: [{ label: "Events", href: ROUTE_POINT.events }],
    footerTagline: "Discover and book sports events near you.",
    footerQuickLinks: {
      authenticated: [{ href: ROUTE_POINT.events, label: "Events" }],
      anonymous: [{ href: ROUTE_POINT.events, label: "Events" }],
    },
    profileLinks: [
      {
        href: ROUTE_POINT.myBookings,
        label: "My bookings",
        icon: "CalendarCheck",
      },
    ],
    features: {
      turfHost: false,
      eventsPublic: true,
      eventsHost: false,
      platformAdmin: false,
    },
    metadata: {
      titleSuffix: "Discover & Book Sports Events",
      description:
        "Find sports events near you, book your spot, and manage your bookings in one place.",
    },
  },
  eventsmanagement: {
    homeRoute: ROUTE_POINT.host.events.dashboard,
    allowedExact: ["/platform-admin"],
    allowedPrefixes: [
      "/host/events",
      "/platform-admin/withdrawals",
      "/platform-admin/support",
      "/platform-admin/events",
    ],
    navLinks: [
      { label: "Dashboard", href: ROUTE_POINT.host.events.dashboard },
    ],
    footerTagline:
      "Create and manage sports events, bookings, and payouts from one place.",
    footerQuickLinks: {
      authenticated: [
        { href: ROUTE_POINT.host.events.dashboard, label: "Dashboard" },
      ],
      anonymous: [{ href: ROUTE_POINT.auth.register, label: "Get Started" }],
    },
    profileLinks: [
      {
        href: ROUTE_POINT.host.events.dashboard,
        label: "Event management",
        icon: "Ticket",
      },
    ],
    features: {
      turfHost: false,
      eventsPublic: false,
      eventsHost: true,
      platformAdmin: true,
    },
    metadata: {
      titleSuffix: "Host & Manage Sports Events",
      description:
        "Create events, manage bookings, and handle payouts from one host dashboard.",
    },
  },
};

export const currentApp = APPS[ENV_CONFIG.APP_TYPE];
