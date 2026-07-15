"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ROUTE_POINT } from "@/lib/constants/route-point";
import { useProfile } from "@/lib/hooks/auth";
import { Loader2 } from "lucide-react";

type Variant = "hero" | "final";

export default function HomeAuthCtas({ variant }: { variant: Variant }) {
  const { data: user, isLoading } = useProfile();

  if (isLoading) {
    return (
      <div className="flex h-12 items-center justify-center sm:justify-start">
        <Loader2 className="h-5 w-5 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (user) {
    return (
      <Link href={ROUTE_POINT.host.turves.dashboard}>
        <Button
          size="lg"
          className={
            variant === "final"
              ? "bg-white px-8 py-3 text-lg text-emerald-700 hover:bg-gray-50"
              : "bg-emerald-600 px-8 py-3 text-lg text-white hover:bg-emerald-500"
          }
        >
          Go to Dashboard
        </Button>
      </Link>
    );
  }

  if (variant === "hero") {
    return (
      <div className="flex flex-col gap-3 sm:flex-row">
        <Link href={ROUTE_POINT.auth.register}>
          <Button
            size="lg"
            className="w-full bg-emerald-600 px-8 py-3 text-lg text-white hover:bg-emerald-500 sm:w-auto"
          >
            List Your Turf
          </Button>
        </Link>
        <Link href={ROUTE_POINT.auth.login}>
          <Button
            size="lg"
            variant="outline"
            className="w-full border-gray-300 bg-white px-8 py-3 text-lg text-gray-900 hover:bg-gray-50 sm:w-auto"
          >
            Sign In
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <Link href={ROUTE_POINT.auth.register}>
      <Button
        size="lg"
        variant="secondary"
        className="bg-white px-8 py-3 text-lg text-emerald-700 hover:bg-gray-50"
      >
        Get Started Free
      </Button>
    </Link>
  );
}
