import ENV_CONFIG from "@/config/env.config";
import { currentApp } from "@/config/apps";
import type { AppType } from "@/config/env.config";

export type { AppType };

export const APP_TYPE: AppType = ENV_CONFIG.APP_TYPE;
export const APP_NAME = ENV_CONFIG.APP_NAME;

export function getDefaultHomeRoute(): string {
  return currentApp.homeRoute;
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

  if (currentApp.allowedExact.includes(path)) {
    return true;
  }

  return currentApp.allowedPrefixes.some((prefix) =>
    matchesPrefix(path, prefix),
  );
}
