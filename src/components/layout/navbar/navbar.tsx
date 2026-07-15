"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ROUTE_POINT } from "@/lib/constants/route-point";
import {
  APP_NAME,
  getDefaultHomeRoute,
  showEventsHost,
  showEventsPublic,
  showTurfHost,
} from "@/lib/constants/app-type";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import ProfileDropdown from "./ProfileDropdown";

const HOME_HREF = getDefaultHomeRoute();

const NAV_LINKS = showTurfHost
  ? [
      { label: "How it works", href: "/#how-it-works" },
      { label: "Features", href: "/#features" },
    ]
  : showEventsPublic
    ? [{ label: "Events", href: ROUTE_POINT.events }]
    : showEventsHost
      ? [{ label: "Dashboard", href: ROUTE_POINT.host.events.dashboard }]
      : [];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-gray-200 bg-white/95 shadow-sm backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center gap-4">
          <div className="flex items-center">
            <Link href={HOME_HREF} className="flex shrink-0 items-center">
              <h1 className="text-2xl font-bold font-heading text-emerald-600">{APP_NAME}</h1>
            </Link>
          </div>

          <div className="hidden flex-1 items-center justify-center gap-2 md:flex lg:gap-4">
            {NAV_LINKS.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="hidden items-center md:flex">
            <ProfileDropdown />
          </div>

          <div className="ml-auto flex items-center md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen((prev) => !prev)}
              aria-label="Toggle menu"
              className="text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden">
          <div className="border-t border-gray-200 bg-white px-2 pb-3 pt-2 shadow-lg sm:px-3">
            <div className="space-y-1 px-3 pb-2">
              {NAV_LINKS.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="block rounded-md px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
            <div className="border-t border-gray-100 px-3 pb-3 pt-3">
              <ProfileDropdown />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
