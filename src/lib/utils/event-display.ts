import type { EventStatus } from "@/modules/host/types/event";
import { cn } from "@/lib/utils";

export function eventStatusLabel(status: EventStatus | undefined): string {
  switch (status) {
    case "draft":
      return "Draft";
    case "pending_approval":
      return "Pending approval";
    case "published":
      return "Published";
    case "rejected":
      return "Rejected";
    case "closed":
      return "Closed";
    default:
      return "Draft";
  }
}

export function eventStatusVariant(
  status: EventStatus | undefined,
): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case "published":
      return "default";
    case "pending_approval":
      return "secondary";
    case "rejected":
      return "destructive";
    case "closed":
      return "outline";
    case "draft":
    default:
      return "outline";
  }
}

/** True when event accepts new registrations (default when unset). */
export function isEventOpenForRegistrations(
  registrationsPaused: boolean | undefined,
): boolean {
  return registrationsPaused !== true;
}

export function eventRegistrationHoldLabel(
  registrationsPaused: boolean | undefined,
): string {
  return isEventOpenForRegistrations(registrationsPaused)
    ? "Open for bookings"
    : "Bookings on hold";
}

export function eventRegistrationHoldActionLabel(
  registrationsPaused: boolean | undefined,
): string {
  return isEventOpenForRegistrations(registrationsPaused)
    ? "Pause bookings"
    : "Resume bookings";
}

export function eventRegistrationHoldBadgeClassName(
  registrationsPaused: boolean | undefined,
): string {
  return cn(
    isEventOpenForRegistrations(registrationsPaused)
      ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-50"
      : "border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-50",
  );
}
