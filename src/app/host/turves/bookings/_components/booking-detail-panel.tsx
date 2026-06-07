"use client";

import BookingActions from "./booking-action-dialogs";
import { Badge } from "@/components/ui/badge";
import { formatInr } from "@/lib/utils/currency";
import { cn } from "@/lib/utils";
import { useOwnerBooking } from "@/modules/host/hooks/use-owner-bookings";
import type {
  BookedByUser,
  OwnerBooking,
  PaymentStatus,
  TurfBookingStatus,
} from "@/modules/host/types/owner-booking";
import type { Turf } from "@/modules/host/types/turf";
import { format, formatDistanceStrict } from "date-fns";
import {
  Calendar,
  CalendarClock,
  Clock,
  IndianRupee,
  Loader2,
  Receipt,
  Users,
} from "lucide-react";

function turfName(turf: Turf | string) {
  return typeof turf === "string" ? "Turf" : turf?.name ?? "Turf";
}

function getBookedBy(bookedBy: OwnerBooking["bookedBy"]): {
  name: string;
  email?: string;
  phone?: string;
  initial: string;
} {
  if (typeof bookedBy === "string") {
    return { name: "Player", initial: "P" };
  }

  const user = bookedBy as BookedByUser;
  const name = user.fullName || user.email || "Player";
  const initial = (user.fullName?.[0] ?? user.email?.[0] ?? "P").toUpperCase();

  return {
    name,
    email: user.email,
    phone: user.phone,
    initial,
  };
}

function statusVariant(
  status: TurfBookingStatus,
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

interface BookingDetailPanelProps {
  id: string;
}

export default function BookingDetailPanel({ id }: BookingDetailPanelProps) {
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
      <div className="flex flex-col items-center gap-2 py-16 text-center">
        <Receipt className="h-10 w-10 text-gray-300" />
        <p className="text-muted-foreground">Booking not found.</p>
      </div>
    );
  }

  const customer = getBookedBy(booking.bookedBy);
  const slots = booking.timeSlots ?? [];
  const firstSlot = slots[0];
  const slotDateLabel = firstSlot
    ? format(new Date(firstSlot.startTime), "MMM d, yyyy")
    : "—";

  return (
    <div className="-mx-4 flex min-h-full flex-col">
      <div className="space-y-5 px-4 py-4 pb-2">
        {/* Header */}
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
            {turfName(booking.turf)}
          </h2>
          {booking.createdAt ? (
            <p className="text-sm text-muted-foreground">
              Booked {format(new Date(booking.createdAt), "MMM d, yyyy · HH:mm")}
            </p>
          ) : null}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <BookingDetailStat
            icon={IndianRupee}
            label="Total amount"
            value={
              booking.totalAmount != null
                ? formatInr(booking.totalAmount)
                : "—"
            }
          />
          <BookingDetailStat
            icon={Users}
            label="Players"
            value={
              booking.playerCount != null
                ? String(booking.playerCount)
                : "—"
            }
          />
          <BookingDetailStat
            icon={Calendar}
            label="Booking date"
            value={slotDateLabel}
          />
          <BookingDetailStat
            icon={Clock}
            label="Time slots"
            value={slots.length > 0 ? String(slots.length) : "—"}
          />
        </div>

        {/* Customer */}
        <section className="space-y-2.5">
          <h3 className="text-sm font-semibold text-gray-900">Customer</h3>
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

        {/* Time slots */}
        {slots.length > 0 ? (
          <section className="space-y-2.5">
            <h3 className="text-sm font-semibold text-gray-900">Time slots</h3>
            <div className="space-y-2">
              {slots.map((slot, i) => {
                const start = new Date(slot.startTime);
                const end = new Date(slot.endTime);
                const duration = formatDistanceStrict(start, end);

                return (
                  <div
                    key={`${slot.startTime}-${i}`}
                    className="flex gap-3 rounded-xl border bg-card p-3.5"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                      <CalendarClock className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        Slot {i + 1}
                      </p>
                      <p className="mt-0.5 text-sm text-muted-foreground">
                        {format(start, "EEE, MMM d · HH:mm")} –{" "}
                        {format(end, "HH:mm")}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {duration}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ) : null}

        {/* Notes */}
        {booking.notes ? (
          <div className="rounded-xl bg-muted/60 p-4">
            <h3 className="text-sm font-semibold text-gray-900">Notes</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {booking.notes}
            </p>
          </div>
        ) : null}

        {/* Cancel reason */}
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
        <BookingActions booking={booking} />
      </div>
    </div>
  );
}
