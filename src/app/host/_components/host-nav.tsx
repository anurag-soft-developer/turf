"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { CalendarDays, LayoutDashboard, MapPin } from "lucide-react";

const links = [
  { href: "/host", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/host/turfs", label: "My Turfs", icon: MapPin, exact: false },
  {
    href: "/host/bookings",
    label: "Bookings",
    icon: CalendarDays,
    exact: false,
  },
];

export default function HostNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-wrap gap-2 border-b border-gray-200 pb-4">
      {links.map(({ href, label, icon: Icon, exact }) => {
        const active = exact
          ? pathname === href
          : pathname === href || pathname.startsWith(`${href}/`);

        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-emerald-600 text-white"
                : "bg-white text-gray-700 ring-1 ring-gray-200 hover:bg-gray-50",
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
