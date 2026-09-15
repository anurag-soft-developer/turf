/** Key tuples keep the "host" prefix so React Query cache identity is unchanged. */
export const WALLET_QUERY_KEYS = {
  wallet: ["host", "wallet"] as const,
  myWithdrawals: (params?: object) => ["host", "my-withdrawals", params] as const,
  withdrawal: (id: string) => ["host", "withdrawal", id] as const,
} as const;
