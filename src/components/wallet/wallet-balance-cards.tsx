"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatInr } from "@/lib/utils/currency";
import { useWallet } from "@/modules/host/hooks/use-wallet";
import {
  getAvailableBalanceForLane,
  type Wallet,
  type WalletType,
} from "@/types/wallet";
import { Loader2 } from "lucide-react";

const laneLabel: Record<WalletType, string> = {
  turf: "turf",
  event: "event",
};

const BALANCE_ITEMS: {
  label: string;
  highlight?: boolean;
  getValue: (wallet: Wallet, walletType: WalletType) => number;
}[] = [
  {
    label: "Available to withdraw",
    highlight: true,
    getValue: (wallet, walletType) =>
      getAvailableBalanceForLane(wallet, walletType),
  },
  {
    label: "On hold (pending withdrawals)",
    getValue: (wallet, walletType) =>
      walletType === "turf"
        ? wallet.turfWallet.heldBalance
        : wallet.eventWallet.heldBalance,
  },
  {
    label: "In escrow",
    getValue: (wallet, walletType) =>
      walletType === "turf"
        ? wallet.turfWallet.escrowBalance
        : wallet.eventWallet.escrowBalance,
  },
  {
    label: "Total earnings",
    getValue: (wallet, walletType) =>
      walletType === "turf"
        ? wallet.turfWallet.totalEarnings
        : wallet.eventWallet.totalEarnings,
  },
  {
    label: "Total withdrawn",
    getValue: (wallet, walletType) =>
      walletType === "turf"
        ? wallet.turfWallet.totalWithdrawn
        : wallet.eventWallet.totalWithdrawn,
  },
];

interface WalletBalanceCardsProps {
  walletType: WalletType;
}

export default function WalletBalanceCards({ walletType }: WalletBalanceCardsProps) {
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
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Showing {laneLabel[walletType]} lane balances only.
      </p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {BALANCE_ITEMS.map((item) => (
          <Card
            key={item.label}
            className={item.highlight ? "ring-1 ring-emerald-200" : undefined}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {item.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p
                className={`text-2xl font-bold ${
                  item.highlight ? "text-emerald-700" : "text-gray-900"
                }`}
              >
                {formatInr(item.getValue(wallet, walletType))}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
