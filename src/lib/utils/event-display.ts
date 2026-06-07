import type { EventStatus } from "@/modules/host/types/event";

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
