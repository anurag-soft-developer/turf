"use client";

import { InfiniteScrollSentinel } from "@/components/infinite-scroll/infinite-scroll-sentinel";
import { ScrollableListPanel } from "@/components/infinite-scroll/scrollable-list-panel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { flattenPaginatedPages } from "@/lib/query/paginated-infinite";
import { formatInr } from "@/lib/utils/currency";
import { cn } from "@/lib/utils";
import { withdrawalStatusVariant } from "@/lib/utils/withdrawal-display";
import {
  useCancelWithdrawal,
  useInfiniteMyWithdrawals,
} from "@/modules/host/hooks/use-withdrawals";
import type { WalletType } from "@/types/wallet";
import type { Withdrawal, WithdrawalStatus } from "@/types/withdrawal";
import { format } from "date-fns";
import { ChevronRight, Loader2 } from "lucide-react";
import { useState } from "react";

const STATUS_TABS: { label: string; status?: WithdrawalStatus }[] = [
  { label: "All" },
  { label: "Pending", status: "pending" },
  { label: "Approved", status: "approved" },
  { label: "Processing", status: "processing" },
  { label: "Settled", status: "settled" },
  { label: "Rejected", status: "rejected" },
  { label: "Cancelled", status: "cancelled" },
];

function WithdrawalRow({
  withdrawal,
  onSelect,
}: {
  withdrawal: Withdrawal;
  onSelect: (id: string) => void;
}) {
  const cancelMutation = useCancelWithdrawal();
  const [confirmCancel, setConfirmCancel] = useState(false);

  const handleCancel = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirmCancel) {
      setConfirmCancel(true);
      return;
    }
    await cancelMutation.mutateAsync(withdrawal._id);
    setConfirmCancel(false);
  };

  return (
    <Card
      className="cursor-pointer transition-shadow hover:shadow-md"
      onClick={() => onSelect(withdrawal._id)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect(withdrawal._id);
        }
      }}
      role="button"
      tabIndex={0}
    >
      <CardContent className="flex items-center justify-between gap-4 pt-4">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-semibold text-gray-900">
              {formatInr(withdrawal.amount)}
            </p>
            <Badge variant={withdrawalStatusVariant(withdrawal.status)}>
              {withdrawal.status}
            </Badge>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {format(new Date(withdrawal.createdAt), "MMM d, yyyy · HH:mm")}
          </p>
          {withdrawal.rejectionReason ? (
            <p className="mt-1 text-sm text-destructive">
              {withdrawal.rejectionReason}
            </p>
          ) : null}
        </div>
        <div className="flex items-center gap-2">
          {withdrawal.status === "pending" ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className={
                confirmCancel ? "border-destructive text-destructive" : undefined
              }
              disabled={cancelMutation.isPending}
              onClick={handleCancel}
            >
              {cancelMutation.isPending
                ? "Cancelling..."
                : confirmCancel
                  ? "Confirm cancel"
                  : "Cancel"}
            </Button>
          ) : null}
          <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
        </div>
      </CardContent>
    </Card>
  );
}

interface WithdrawalHistoryProps {
  walletType: WalletType;
  onSelectWithdrawal: (id: string) => void;
  className?: string;
}

export default function WithdrawalHistory({
  walletType,
  onSelectWithdrawal,
  className,
}: WithdrawalHistoryProps) {
  const [activeStatus, setActiveStatus] = useState<WithdrawalStatus | undefined>();

  const {
    data,
    isLoading,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetchNextPageError,
  } = useInfiniteMyWithdrawals({ status: activeStatus, walletType });

  const withdrawals = flattenPaginatedPages(data?.pages);

  return (
    <ScrollableListPanel
      className={cn("shrink-0", className)}
      header={
        <div className="space-y-4 pb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Withdrawal history
          </h3>

          <div className="flex flex-wrap gap-2">
            {STATUS_TABS.map((tab) => (
              <button
                key={tab.label}
                type="button"
                onClick={() => setActiveStatus(tab.status)}
                className={`rounded-full px-3 py-1 text-sm font-medium ring-1 ${
                  activeStatus === tab.status
                    ? "bg-emerald-600 text-white ring-emerald-600"
                    : "bg-white text-gray-700 ring-gray-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      }
    >
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
        </div>
      ) : isError ? (
        <p className="text-center text-muted-foreground">
          Failed to load withdrawals.{" "}
          <button
            type="button"
            className="text-emerald-600 underline"
            onClick={() => refetch()}
          >
            Retry
          </button>
        </p>
      ) : withdrawals.length === 0 ? (
        <p className="py-8 text-center text-muted-foreground">
          No withdrawal requests yet.
        </p>
      ) : (
        <div className="flex flex-col gap-3 pb-4">
          {withdrawals.map((w) => (
            <WithdrawalRow
              key={w._id}
              withdrawal={w}
              onSelect={onSelectWithdrawal}
            />
          ))}
          <InfiniteScrollSentinel
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
            fetchNextPage={() => fetchNextPage()}
            isError={isFetchNextPageError}
            onRetry={() => fetchNextPage()}
          />
        </div>
      )}
    </ScrollableListPanel>
  );
}
