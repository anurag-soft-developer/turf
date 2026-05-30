export const PLATFORM_ADMIN_QUERY_KEYS = {
  adminWithdrawals: (params?: object) =>
    ["platform-admin", "withdrawals", params] as const,
  adminWithdrawal: (id: string) =>
    ["platform-admin", "withdrawal", id] as const,
} as const;
