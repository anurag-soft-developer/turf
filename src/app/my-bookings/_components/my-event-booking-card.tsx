"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type {
  EventBooking,
  EventBookingStatus,
} from "@/modules/event-bookings/types/booking";
import type { HostEvent } from "@/modules/host/types/event";
import { format } from "date-fns";
import { ChevronRight } from "lucide-react";

function getEventTitle(event: HostEvent | string) {
  return typeof event === "string" ? "Event" : event?.title ?? "Event";
}

function getEventDate(event: HostEvent | string) {
  if (typeof event === "string" || !event.eventDate) return "—";
  return format(new Date(event.eventDate), "MMM d, yyyy · HH:mm");
}

function statusVariant(
  status: EventBookingStatus,
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

export default function MyEventBookingCard({
  booking,
  onSelect,
}: {
  booking: EventBooking;
  onSelect: (booking: EventBooking) => void;
}) {
  const registeredLabel = booking.createdAt
    ? format(new Date(booking.createdAt), "MMM d, yyyy")
    : "—";
  const subline =
    booking.bookingId && booking.paymentStatus === "paid"
      ? `Registered ${registeredLabel} · ${booking.bookingId}`
      : `Registered ${registeredLabel}`;

  return (
    <button
      type="button"
      onClick={() => onSelect(booking)}
      className="block w-full text-left"
    >
      <Card className="transition-shadow hover:shadow-md">
        <CardContent className="flex items-center justify-between gap-4 pt-4">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-semibold text-gray-900">
                {getEventTitle(booking.event)}
              </p>
              <Badge variant={statusVariant(booking.status)}>
                {booking.status}
              </Badge>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{subline}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Event: {getEventDate(booking.event)}
            </p>
            <p className="mt-1 text-sm font-medium text-emerald-700">
              ₹{booking.totalAmount}
            </p>
          </div>
          <ChevronRight className="h-5 w-5 shrink-0 text-gray-400" />
        </CardContent>
      </Card>
    </button>
  );
}
