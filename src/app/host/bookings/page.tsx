"use client";

import OwnerBookingCard from "./_components/owner-booking-card";
import QrCheckInScanner from "./_components/qr-check-in-scanner";
import { Button } from "@/components/ui/button";
import { useOwnerBookings } from "@/modules/host/hooks/use-owner-bookings";
import type { TurfBookingStatus } from "@/modules/host/types/owner-booking";
import { Loader2, QrCode } from "lucide-react";
import { useState } from "react";

const TABS: { label: string; status?: TurfBookingStatus }[] = [
  { label: "All" },
  { label: "Pending", status: "pending" },
  { label: "Confirmed", status: "confirmed" },
  { label: "Cancelled", status: "cancelled" },
  { label: "Completed", status: "completed" },
];

export default function HostBookingsPage() {
  const [activeStatus, setActiveStatus] = useState<TurfBookingStatus | undefined>();
  const [showScanner, setShowScanner] = useState(false);

  const { data, isLoading, isError, refetch } = useOwnerBookings({
    status: activeStatus,
    limit: 50,
    sortOrder: "desc",
  });

  const bookings = data?.data ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-gray-900">Turf bookings</h2>
        <Button
          type="button"
          variant="outline"
          onClick={() => setShowScanner((v) => !v)}
        >
          <QrCode className="mr-2 h-4 w-4" />
          {showScanner ? "Hide scanner" : "Scan QR check-in"}
        </Button>
      </div>

      {showScanner ? <QrCheckInScanner onClose={() => setShowScanner(false)} /> : null}

      <div className="flex flex-wrap gap-2">
        {TABS.map((tab) => (
          <button
            key={tab.label}
            type="button"
            onClick={() => setActiveStatus(tab.status)}
            className={`rounded-full px-3 py-1 text-sm font-medium ring-1 ${
              activeStatus === tab.status
                ? "bg-emerald-600 text-white ring-emerald-600"
                : "bg-white text-gray-700 ring-gray-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
        </div>
      ) : isError ? (
        <p className="text-center text-muted-foreground">
          Failed to load bookings.{" "}
          <button
            type="button"
            className="text-emerald-600 underline"
            onClick={() => refetch()}
          >
            Retry
          </button>
        </p>
      ) : bookings.length === 0 ? (
        <p className="py-12 text-center text-muted-foreground">
          No bookings in this category yet.
        </p>
      ) : (
        <div className="space-y-3">
          {bookings.map((booking) => (
            <OwnerBookingCard key={booking._id} booking={booking} />
          ))}
        </div>
      )}
    </div>
  );
}
