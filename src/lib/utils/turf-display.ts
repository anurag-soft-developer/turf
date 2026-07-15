import type { TurfStatus } from "@/types/turf";
import { cn } from "@/lib/utils";

export function turfStatusLabel(status: TurfStatus | undefined): string {
  switch (status) {
    case "draft":
      return "Draft";
    case "pending_approval":
      return "Pending approval";
    case "published":
      return "Published";
    case "rejected":
      return "Rejected";
    default:
      return "Draft";
  }
}

export function turfStatusVariant(
  status: TurfStatus | undefined,
): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case "published":
      return "default";
    case "pending_approval":
      return "secondary";
    case "rejected":
      return "destructive";
    case "draft":
    default:
      return "outline";
  }
}

/** True when turf accepts new bookings (default when unset). */
export function isTurfOpenForBookings(isAvailable: boolean | undefined): boolean {
  return isAvailable !== false;
}

export function turfBookingHoldLabel(isAvailable: boolean | undefined): string {
  return isTurfOpenForBookings(isAvailable)
    ? "Open for bookings"
    : "Bookings on hold";
}

export function turfBookingHoldActionLabel(
  isAvailable: boolean | undefined,
): string {
  return isTurfOpenForBookings(isAvailable)
    ? "Pause bookings"
    : "Resume bookings";
}

export function turfBookingHoldBadgeClassName(
  isAvailable: boolean | undefined,
): string {
  return cn(
    isTurfOpenForBookings(isAvailable)
      ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-50"
      : "border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-50",
  );
}
