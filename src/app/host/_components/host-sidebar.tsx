"use client";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";
import {
  CalendarDays,
  LayoutDashboard,
  MapPin,
  Menu,
  Wallet,
} from "lucide-react";
import { useHostOnboardingStatus } from "@/modules/host/hooks/use-host-onboarding";
import { isHostOnboardingComplete } from "@/modules/host/types/host-onboarding";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

function HostSidebarLinks({
  className,
  onNavigate,
}: {
  className?: string;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const { data: onboarding } = useHostOnboardingStatus();
  const canPublish = isHostOnboardingComplete(onboarding);

  const links = [
    {
      href: "/host",
      label: "Dashboard",
      icon: LayoutDashboard,
      exact: true,
      disabled: !canPublish,
    },
    {
      href: "/host/turfs",
      label: "My Turfs",
      icon: MapPin,
      exact: false,
      disabled: !canPublish,
    },
    {
      href: "/host/bookings",
      label: "Bookings",
      icon: CalendarDays,
      exact: false,
      disabled: !canPublish,
    },
    {
      href: "/host/onboarding",
      label: "Payout setup",
      icon: Wallet,
      exact: true,
      disabled: canPublish,
    },
  ];

  return (
    <nav className={cn("flex flex-col gap-1", className)}>
      {links
        .filter((l) => !l.disabled)
        .map(({ href, label, icon: Icon, exact }) => {
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
                  ? "bg-emerald-600 text-white"
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

export default function HostSideBar() {
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
          aria-label="Open host menu"
        >
          <Menu className="h-4 w-4" />
          Menu
        </Button>
      </div>

      <Drawer open={menuOpen} onOpenChange={setMenuOpen} direction="left">
        <DrawerContent className="max-w-xs">
          <DrawerHeader className="border-b py-3">
            <DrawerTitle className="text-lg">Host</DrawerTitle>
          </DrawerHeader>
          <HostSidebarLinks
            className="px-4 py-4"
            onNavigate={() => setMenuOpen(false)}
          />
        </DrawerContent>
      </Drawer>

      <HostSidebarLinks className="hidden w-52 shrink-0 border-r border-gray-200 pr-6 md:flex" />
    </>
  );
}
