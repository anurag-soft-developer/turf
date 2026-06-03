import type { TurfStatus } from "@/types/turf";

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
