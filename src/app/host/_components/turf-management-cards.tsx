"use client";

import { turfDrawerUrl } from "@/app/host/_lib/drawer-urls";
import { useHostOnboardingStatus } from "@/modules/host/hooks/use-host-onboarding";
import { isHostOnboardingComplete } from "@/modules/host/types/host-onboarding";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Plus } from "lucide-react";

export default function TurfManagementCards() {
  const { data: onboarding } = useHostOnboardingStatus();
  const canPublish = isHostOnboardingComplete(onboarding);
  const addHref = canPublish ? turfDrawerUrl("new") : "/host/onboarding";

  return (
    <section>
      <h2 className="mb-4 text-xl font-bold text-gray-900">Turf Management</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <Link href={addHref}>
          <Card className="h-full transition-shadow hover:shadow-md">
            <CardContent className="flex flex-col gap-3 pt-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                <Plus className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-emerald-700">
                  {canPublish ? "Add New Turf" : "Complete payout setup"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {canPublish
                    ? "Create a new turf listing"
                    : "Verify bank details to publish turfs"}
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link href="/host/turfs">
          <Card className="h-full transition-shadow hover:shadow-md">
            <CardContent className="flex flex-col gap-3 pt-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 text-green-700">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-green-700">My Turfs</p>
                <p className="text-sm text-muted-foreground">
                  Manage existing turfs
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </section>
  );
}
