"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatInr } from "@/lib/utils/currency";
import { useWallet } from "@/modules/host/hooks/use-wallet";
import { Loader2 } from "lucide-react";

const BALANCE_ITEMS = [
  { key: "availableBalance", label: "Available to withdraw", highlight: true },
  { key: "heldBalance", label: "On hold (pending withdrawals)" },
  { key: "escrowBalance", label: "In escrow" },
  { key: "totalEarnings", label: "Total earnings" },
  { key: "totalWithdrawn", label: "Total withdrawn" },
] as const;

export default function WalletBalanceCards() {
  const { data: wallet, isLoading, isError, refetch } = useWallet();

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (isError || !wallet) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          Failed to load wallet.{" "}
          <button
            type="button"
            className="text-emerald-600 underline"
            onClick={() => refetch()}
          >
            Retry
          </button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {BALANCE_ITEMS.map((item) => (
        <Card
          key={item.key}
          className={"highlight" in item && item.highlight ? "ring-1 ring-emerald-200" : undefined}
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {item.label}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p
              className={`text-2xl font-bold ${
                "highlight" in item && item.highlight
                  ? "text-emerald-700"
                  : "text-gray-900"
              }`}
            >
              {formatInr(wallet[item.key])}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
