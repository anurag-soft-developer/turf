"use client";

import Link from "next/link";
import { ROUTE_POINT } from "@/lib/constants/route-point";
import {
  APP_NAME,
  getDefaultHomeRoute,
  showEventsHost,
  showEventsPublic,
  showTurfHost,
} from "@/lib/constants/app-type";
import { useProfile } from "@/lib/hooks/auth";

const HOME_HREF = getDefaultHomeRoute();

const TAGLINE = showTurfHost
  ? "The host platform for turf owners. Publish your venue, manage bookings, and grow your sports business."
  : showEventsPublic
    ? "Discover and book sports events near you."
    : "Create and manage sports events, bookings, and payouts from one place.";

export default function Footer() {
  const { data: user } = useProfile();

  const quickLinks = [
    { href: HOME_HREF, label: "Home" },
    ...(user
      ? showTurfHost
        ? [{ href: ROUTE_POINT.host.turves.dashboard, label: "Dashboard" }]
        : showEventsHost
          ? [{ href: ROUTE_POINT.host.events.dashboard, label: "Dashboard" }]
          : showEventsPublic
            ? [{ href: ROUTE_POINT.events, label: "Events" }]
            : []
      : [
          ...(showTurfHost
            ? [{ href: ROUTE_POINT.auth.register, label: "List Your Turf" }]
            : showEventsHost
              ? [{ href: ROUTE_POINT.auth.register, label: "Get Started" }]
              : showEventsPublic
                ? [{ href: ROUTE_POINT.events, label: "Events" }]
                : []),
          { href: ROUTE_POINT.auth.login, label: "Sign In" },
        ]),
  ];

  return (
    <footer className="border-t border-gray-200 bg-gray-50 py-12 text-gray-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="md:col-span-2">
            <h3 className="font-heading mb-4 text-2xl font-bold text-emerald-600">
              {APP_NAME}
            </h3>
            <p className="max-w-md text-gray-600">{TAGLINE}</p>
          </div>

          <div>
            <h4 className="font-heading mb-4 text-lg font-semibold text-gray-900">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {quickLinks.map(({ href, label }) => (
                <li key={`${href}-${label}`}>
                  <Link
                    href={href}
                    className="text-gray-600 transition-colors hover:text-emerald-600"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-200 pt-8 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
