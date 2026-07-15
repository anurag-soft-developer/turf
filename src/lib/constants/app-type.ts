import ENV_CONFIG from "@/config/env.config";
import { ROUTE_POINT } from "@/lib/constants/route-point";
import type { AppType } from "@/config/env.config";

export type { AppType };

export const APP_TYPE: AppType = ENV_CONFIG.APP_TYPE;
export const APP_NAME = ENV_CONFIG.APP_NAME;

export const showTurfHost = APP_TYPE === "turfmanagement";
export const showEventsPublic = APP_TYPE === "events";
export const showEventsHost = APP_TYPE === "eventsmanagement";
export const showPlatformAdmin =
  APP_TYPE === "turfmanagement" || APP_TYPE === "eventsmanagement";

export function getDefaultHomeRoute(): string {
  switch (APP_TYPE) {
    case "turfmanagement":
      return ROUTE_POINT.home;
    case "events":
      return ROUTE_POINT.events;
    case "eventsmanagement":
      return ROUTE_POINT.host.events.dashboard;
  }
}

function matchesPrefix(pathname: string, prefix: string): boolean {
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

function normalizePath(pathname: string): string {
  if (pathname.length > 1 && pathname.endsWith("/")) {
    return pathname.slice(0, -1);
  }
  return pathname;
}

/** Whether a pathname is allowed for the current APP_TYPE (shared routes always allowed). */
export function isPathAllowed(pathname: string): boolean {
  const path = normalizePath(pathname);

  if (
    matchesPrefix(path, "/auth") ||
    matchesPrefix(path, "/settings") ||
    matchesPrefix(path, "/notifications")
  ) {
    return true;
  }

  switch (APP_TYPE) {
    case "turfmanagement":
      if (path === "/") return true;
      if (matchesPrefix(path, "/host/turves")) return true;
      if (path === "/platform-admin") return true;
      if (matchesPrefix(path, "/platform-admin/withdrawals")) return true;
      if (matchesPrefix(path, "/platform-admin/turves")) return true;
      return false;

    case "events":
      if (matchesPrefix(path, "/events")) return true;
      if (matchesPrefix(path, "/my-bookings")) return true;
      if (matchesPrefix(path, "/payments")) return true;
      return false;

    case "eventsmanagement":
      if (matchesPrefix(path, "/host/events")) return true;
      if (path === "/platform-admin") return true;
      if (matchesPrefix(path, "/platform-admin/withdrawals")) return true;
      if (matchesPrefix(path, "/platform-admin/events")) return true;
      return false;
  }
}
