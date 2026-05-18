"use client";

import BookingActions from "./_components/booking-action-dialogs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useOwnerBooking } from "@/modules/host/hooks/use-owner-bookings";
import type { Turf } from "@/modules/host/types/turf";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { use } from "react";

function turfName(turf: Turf | string) {
  return typeof turf === "string" ? turf : turf?.name;
}

export default function HostBookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: booking, isLoading, isError } = useOwnerBooking(id);

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (isError || !booking) {
    return (
      <p className="text-muted-foreground">
        Booking not found.{" "}
        <Link href="/host/bookings" className="text-emerald-600 underline">
          Back to bookings
        </Link>
      </p>
    );
  }

  const bookedBy =
    typeof booking.bookedBy === "string"
      ? booking.bookedBy
      : booking.bookedBy.fullName || booking.bookedBy.email;

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/host/bookings"
          className="text-sm text-emerald-600 hover:underline"
        >
          ← Back to bookings
        </Link>
        <h2 className="mt-2 text-2xl font-bold text-gray-900">
          Booking details
        </h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{turfName(booking.turf)}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <p>
            <span className="font-medium">Status:</span> {booking.status}
          </p>
          <p>
            <span className="font-medium">Booked by:</span> {bookedBy}
          </p>
          {booking.totalAmount != null ? (
            <p>
              <span className="font-medium">Amount:</span> ₹{booking.totalAmount}
            </p>
          ) : null}
          {booking.timeSlots?.map((slot, i) => (
            <p key={`${slot.startTime}-${i}`}>
              <span className="font-medium">Slot {i + 1}:</span>{" "}
              {format(new Date(slot.startTime), "MMM d, yyyy HH:mm")} –{" "}
              {format(new Date(slot.endTime), "HH:mm")}
            </p>
          ))}
          {booking.notes ? (
            <p>
              <span className="font-medium">Notes:</span> {booking.notes}
            </p>
          ) : null}
        </CardContent>
      </Card>

      <BookingActions booking={booking} />
    </div>
  );
}
