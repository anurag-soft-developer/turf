import type { WithdrawalStatus } from "@/types/withdrawal";

export function withdrawalStatusVariant(
  status: WithdrawalStatus,
): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case "settled":
    case "approved":
      return "default";
    case "pending":
    case "processing":
      return "secondary";
    case "rejected":
    case "cancelled":
      return "destructive";
    default:
      return "outline";
  }
}

export function userDisplayName(user: { fullName?: string; email?: string } | string) {
  if (typeof user === "string") return user;
  return user.fullName || user.email || "User";
}
