"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ROUTE_POINT } from "@/lib/constants/route-point";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import ProfileDropdown from "./ProfileDropdown";

const NAV_LINKS = [
  { label: "Events", href: ROUTE_POINT.events },
  { label: "About Us", href: "/#about" },
  { label: "Contacts", href: "/#contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-lg fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center gap-4">
          <div className="flex items-center">
            <Link href={ROUTE_POINT.home} className="flex shrink-0 items-center">
              <h1 className="text-2xl font-bold text-green-600">TurfBooking</h1>
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
          <div className="bg-white px-2 pb-3 pt-2 shadow-lg sm:px-3">
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
