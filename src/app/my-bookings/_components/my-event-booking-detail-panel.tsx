"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ROUTE_POINT } from "@/lib/constants/route-point";
import { formatInr } from "@/lib/utils/currency";
import { cn } from "@/lib/utils";
import type {
  EventBooking,
  EventBookingStatus,
  PaymentStatus,
} from "@/modules/event-bookings/types/booking";
import type { HostEvent } from "@/modules/host/types/event";
import { format } from "date-fns";
import { Calendar, ExternalLink, IndianRupee, Ticket, Users } from "lucide-react";

function eventTitle(event: HostEvent | string) {
  return typeof event === "string" ? "Event" : event?.title ?? "Event";
}

function eventDateLabel(event: HostEvent | string) {
  if (typeof event === "string" || !event.eventDate) return "—";
  return format(new Date(event.eventDate), "MMM d, yyyy · HH:mm");
}

function eventSlug(event: HostEvent | string) {
  return typeof event === "string" ? null : event?.slug ?? null;
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

function paymentStatusVariant(
  status: PaymentStatus,
): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case "paid":
      return "default";
    case "pending":
      return "secondary";
    case "failed":
    case "refunded":
      return "destructive";
    default:
      return "outline";
  }
}

function formatStatusLabel(status: string) {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

function BookingDetailStat({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border bg-card p-3.5">
      <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
        <Icon className="h-4 w-4" />
      </div>
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-sm font-semibold text-gray-900">{value}</p>
    </div>
  );
}

export default function MyEventBookingDetailPanel({
  booking,
}: {
  booking: EventBooking;
}) {
  const slug = eventSlug(booking.event);
  const showContinuePayment =
    booking.status === "pending" && Boolean(booking.razorpayPaymentLinkShortUrl);

  return (
    <div className="-mx-4 flex min-h-full flex-col">
      <div className="space-y-5 px-4 py-4 pb-2">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              variant={statusVariant(booking.status)}
              className={cn(
                booking.status === "confirmed" &&
                  "border-emerald-200 bg-emerald-600 text-white hover:bg-emerald-600",
              )}
            >
              {formatStatusLabel(booking.status)}
            </Badge>
            {booking.paymentStatus ? (
              <Badge
                variant={paymentStatusVariant(booking.paymentStatus)}
                className={cn(
                  booking.paymentStatus === "paid" &&
                    "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-50",
                )}
              >
                {formatStatusLabel(booking.paymentStatus)}
              </Badge>
            ) : null}
          </div>
          <h2 className="text-xl font-bold tracking-tight text-gray-900">
            {eventTitle(booking.event)}
          </h2>
          {booking.createdAt ? (
            <p className="text-sm text-muted-foreground">
              Registered{" "}
              {format(new Date(booking.createdAt), "MMM d, yyyy · HH:mm")}
            </p>
          ) : null}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <BookingDetailStat
            icon={IndianRupee}
            label="Total amount"
            value={formatInr(booking.totalAmount)}
          />
          <BookingDetailStat
            icon={Users}
            label="Players"
            value={
              booking.playerCount != null ? String(booking.playerCount) : "—"
            }
          />
          <BookingDetailStat
            icon={Calendar}
            label="Event date"
            value={eventDateLabel(booking.event)}
          />
          <BookingDetailStat
            icon={Ticket}
            label="Booking ID"
            value={booking.bookingId ?? "—"}
          />
        </div>

        <section className="space-y-2.5">
          <h3 className="text-sm font-semibold text-gray-900">Your details</h3>
          <div className="rounded-xl border bg-card p-4">
            <p className="font-medium text-gray-900">{booking.fullName}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {booking.contactNumber}
            </p>
          </div>
        </section>

        {booking.notes ? (
          <div className="rounded-xl bg-muted/60 p-4">
            <h3 className="text-sm font-semibold text-gray-900">Notes</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {booking.notes}
            </p>
          </div>
        ) : null}
      </div>

      <div className="sticky bottom-0 z-10 shrink-0 border-t bg-background px-4 py-3">
        <div className="flex flex-wrap justify-end gap-2">
          {showContinuePayment ? (
            <Button
              type="button"
              size="sm"
              className="bg-emerald-600 hover:bg-emerald-700"
              onClick={() => {
                const url = booking.razorpayPaymentLinkShortUrl;
                if (url) window.location.href = url;
              }}
            >
              Continue payment
            </Button>
          ) : null}
          {slug ? (
            <Link href={ROUTE_POINT.eventDetail(slug)}>
              <Button type="button" size="sm" variant="outline">
                <ExternalLink className="mr-2 h-4 w-4" />
                View event
              </Button>
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}
