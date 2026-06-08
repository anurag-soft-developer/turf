export const PLATFORM_ADMIN_QUERY_KEYS = {
  adminWithdrawals: (params?: object) =>
    ["platform-admin", "withdrawals", params] as const,
  adminWithdrawal: (id: string) =>
    ["platform-admin", "withdrawal", id] as const,
  adminPendingTurfs: (params?: object) =>
    ["platform-admin", "pending-turfs", params] as const,
  adminTurf: (id: string) => ["platform-admin", "turf", id] as const,
  adminPendingEvents: (params?: object) =>
    ["platform-admin", "pending-events", params] as const,
  adminEvent: (id: string) => ["platform-admin", "event", id] as const,
} as const;
