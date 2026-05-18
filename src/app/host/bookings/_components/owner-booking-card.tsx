"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { OwnerBooking } from "@/modules/host/types/owner-booking";
import type { Turf } from "@/modules/host/types/turf";
import { format } from "date-fns";
import { ChevronRight } from "lucide-react";

function getTurfName(turf: Turf | string) {
  return typeof turf === "string" ? "Turf" : turf?.name;
}

function getBookedByName(bookedBy: OwnerBooking["bookedBy"]) {
  if (typeof bookedBy === "string") return "Player";
  return bookedBy.fullName || bookedBy.email || "Player";
}

function statusVariant(
  status: OwnerBooking["status"],
): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case "confirmed":
      return "default";
    case "pending":
      return "secondary";
    case "cancelled":
      return "destructive";
    default:
      return "outline";
  }
}

export default function OwnerBookingCard({ booking }: { booking: OwnerBooking }) {
  const firstSlot = booking.timeSlots?.[0];
  const dateLabel = firstSlot?.startTime
    ? format(new Date(firstSlot.startTime), "MMM d, yyyy · HH:mm")
    : "—";

  return (
    <Link href={`/host/bookings/${booking._id}`}>
      <Card className="transition-shadow hover:shadow-md">
        <CardContent className="flex items-center justify-between gap-4 pt-4">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-semibold text-gray-900">
                {getTurfName(booking.turf)}
              </p>
              <Badge variant={statusVariant(booking.status)}>
                {booking.status}
              </Badge>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {getBookedByName(booking.bookedBy)} · {dateLabel}
            </p>
            {booking.totalAmount != null ? (
              <p className="mt-1 text-sm font-medium text-emerald-700">
                ₹{booking.totalAmount}
              </p>
            ) : null}
          </div>
          <ChevronRight className="h-5 w-5 shrink-0 text-gray-400" />
        </CardContent>
      </Card>
    </Link>
  );
}
