"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useMyTurfs } from "@/modules/host/hooks/use-my-turfs";
import Link from "next/link";
import { Loader2, MapPin, Plus } from "lucide-react";

export default function HostTurfsPage() {
  const { data, isLoading, isError, refetch, isFetching } = useMyTurfs({
    limit: 50,
  });

  const turfs = data?.data ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-gray-900">My Turfs</h2>
        <Link
          href="/host/turfs/new"
          className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-primary px-2.5 text-sm font-medium text-primary-foreground"
        >
          <Plus className="h-4 w-4" />
          Add turf
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
        </div>
      ) : isError ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            Failed to load turfs.{" "}
            <button
              type="button"
              className="text-emerald-600 underline"
              onClick={() => refetch()}
            >
              Retry
            </button>
          </CardContent>
        </Card>
      ) : turfs.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
            <MapPin className="h-12 w-12 text-gray-300" />
            <div>
              <p className="font-semibold text-gray-900">No turfs yet</p>
              <p className="text-sm text-muted-foreground">
                Start by adding your first turf listing.
              </p>
            </div>
            <Link
              href="/host/turfs/new"
              className="inline-flex h-8 items-center rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground"
            >
              Add your first turf
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {isFetching && !isLoading ? (
            <p className="text-sm text-muted-foreground">Refreshing…</p>
          ) : null}
          {turfs.map((turf) => (
            <Link key={turf._id} href={`/host/turfs/${turf._id}`}>
              <Card className="transition-shadow hover:shadow-md">
                <CardContent className="flex items-center justify-between gap-4 pt-4">
                  <div>
                    <p className="font-semibold text-gray-900">{turf?.name}</p>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {turf?.location?.address}
                    </p>
                    <p className="mt-1 text-sm text-emerald-700">
                      ₹{turf?.pricing?.basePricePerHour}/hr
                      {turf?.isAvailable === false ? " · Unavailable" : ""}
                    </p>
                  </div>
                  <MapPin className="h-5 w-5 text-gray-400" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
