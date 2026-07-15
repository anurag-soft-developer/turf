"use client";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { ROUTE_POINT } from "@/lib/constants/route-point";
import { showEventsHost, showTurfHost } from "@/lib/constants/app-type";
import { cn } from "@/lib/utils";
import { Banknote, CalendarCheck2, LayoutDashboard, MapPin, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

function AdminSidebarLinks({
  className,
  onNavigate,
}: {
  className?: string;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  const links = [
    {
      href: ROUTE_POINT.platformAdmin.home,
      label: "Overview",
      icon: LayoutDashboard,
      exact: true,
    },
    {
      href: ROUTE_POINT.platformAdmin.withdrawals,
      label: "Withdrawals",
      icon: Banknote,
    },
    ...(showTurfHost
      ? [
          {
            href: ROUTE_POINT.platformAdmin.turves,
            label: "Turf approvals",
            icon: MapPin,
          },
        ]
      : []),
    ...(showEventsHost
      ? [
          {
            href: ROUTE_POINT.platformAdmin.events,
            label: "Event approvals",
            icon: CalendarCheck2,
          },
        ]
      : []),
  ];

  return (
    <nav className={cn("flex flex-col gap-1", className)}>
      {links.map(({ href, label, icon: Icon, exact }) => {
        const active = exact
          ? pathname === href
          : pathname === href || pathname.startsWith(`${href}/`);

        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            className={cn(
              "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              active
                ? "bg-indigo-600 text-white"
                : "text-gray-700 hover:bg-white hover:ring-1 hover:ring-gray-200",
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

export default function PlatformAdminSidebar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <div className="flex items-center md:hidden">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={() => setMenuOpen(true)}
          aria-label="Open admin menu"
        >
          <Menu className="h-4 w-4" />
          Menu
        </Button>
      </div>

      <Drawer open={menuOpen} onOpenChange={setMenuOpen} direction="left">
        <DrawerContent className="max-w-xs">
          <DrawerHeader className="border-b py-3">
            <DrawerTitle className="text-lg">Platform Admin</DrawerTitle>
          </DrawerHeader>
          <AdminSidebarLinks
            className="px-4 py-4"
            onNavigate={() => setMenuOpen(false)}
          />
        </DrawerContent>
      </Drawer>

      <AdminSidebarLinks className="sticky top-0 hidden max-h-full w-52 shrink-0 self-start overflow-y-auto border-r border-gray-200 pr-6 md:flex" />
    </>
  );
}
