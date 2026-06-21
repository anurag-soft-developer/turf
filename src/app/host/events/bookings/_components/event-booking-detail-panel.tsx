"use client";

import EventBookingActions from "./event-booking-action-dialogs";
import { Badge } from "@/components/ui/badge";
import { formatInr } from "@/lib/utils/currency";
import { cn } from "@/lib/utils";
import { useOwnerEventBooking } from "@/modules/host/hooks/use-owner-event-bookings";
import type {
  BookedByUser,
  EventBookingStatus,
  OwnerEventBooking,
  PaymentStatus,
} from "@/modules/host/types/owner-event-booking";
import type { HostEvent } from "@/modules/host/types/event";
import { format } from "date-fns";
import {
  Calendar,
  IndianRupee,
  Loader2,
  Receipt,
  Ticket,
  Users,
} from "lucide-react";

function eventTitle(event: HostEvent | string) {
  return typeof event === "string" ? "Event" : event?.title ?? "Event";
}

function eventDateLabel(event: HostEvent | string) {
  if (typeof event === "string" || !event.eventDate) return "—";
  return format(new Date(event.eventDate), "MMM d, yyyy · HH:mm");
}

function getCustomer(booking: OwnerEventBooking): {
  name: string;
  email?: string;
  phone?: string;
  initial: string;
} {
  const bookedBy =
    typeof booking.bookedBy === "string" ? null : (booking.bookedBy as BookedByUser);
  const name = booking.fullName || bookedBy?.fullName || bookedBy?.email || "Registrant";
  const email = bookedBy?.email;
  const phone = booking.contactNumber || bookedBy?.phone;
  const initial = (name[0] ?? "R").toUpperCase();

  return { name, email, phone, initial };
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

interface EventBookingDetailPanelProps {
  id: string;
}

export default function EventBookingDetailPanel({ id }: EventBookingDetailPanelProps) {
  const { data: booking, isLoading, isError } = useOwnerEventBooking(id);

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (isError || !booking) {
    return (
      <div className="flex flex-col items-center gap-2 py-16 text-center">
        <Receipt className="h-10 w-10 text-gray-300" />
        <p className="text-muted-foreground">Booking not found.</p>
      </div>
    );
  }

  const customer = getCustomer(booking);

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
          <h3 className="text-sm font-semibold text-gray-900">Registrant</h3>
          <div className="flex items-start gap-3 rounded-xl border bg-card p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-semibold text-emerald-700">
              {customer.initial}
            </div>
            <div className="min-w-0 space-y-0.5">
              <p className="font-medium text-gray-900">{customer.name}</p>
              {customer.email ? (
                <p className="truncate text-sm text-muted-foreground">
                  {customer.email}
                </p>
              ) : null}
              {customer.phone ? (
                <p className="text-sm text-muted-foreground">{customer.phone}</p>
              ) : null}
            </div>
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

        {booking.cancelReason ? (
          <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4">
            <h3 className="text-sm font-semibold text-destructive">
              Cancellation reason
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-destructive/90">
              {booking.cancelReason}
            </p>
          </div>
        ) : null}
      </div>

      <div className="sticky bottom-0 z-10 shrink-0 border-t bg-background px-4 py-3">
        <EventBookingActions booking={booking} />
      </div>
    </div>
  );
}
