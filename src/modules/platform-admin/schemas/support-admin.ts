import type { SupportQuery, SupportQueryStatus } from "@/types/support";

export function formatSupportStatus(status: SupportQueryStatus): string {
  switch (status) {
    case "in_progress":
      return "In progress";
    case "resolved":
      return "Resolved";
    default:
      return "Open";
  }
}

export function supportStatusVariant(
  status: SupportQueryStatus,
): "default" | "secondary" | "outline" {
  switch (status) {
    case "resolved":
      return "outline";
    case "in_progress":
      return "default";
    default:
      return "secondary";
  }
}

export function queryContact(query: SupportQuery): string {
  return query.email || query.phone || "—";
}

export function getNextSupportStatuses(
  current: SupportQueryStatus,
): SupportQueryStatus[] {
  return (["open", "in_progress", "resolved"] as const).filter(
    (status) => status !== current,
  );
}
