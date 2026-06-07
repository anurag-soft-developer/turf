"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  useUpdatePayoutDetails,
  useWallet,
} from "@/modules/host/hooks/use-wallet";
import {
  hasBankData,
  hasCompleteBankDetails,
  hasCompletePayoutDetails,
  hasCompleteUpiDetails,
  hasUpiData,
  payoutMethodLabel,
  resolvePrimaryMethod,
} from "@/modules/host/schemas/wallet-form";
import type { PayoutMethod } from "@/types/wallet";
import { Loader2 } from "lucide-react";

interface PayoutDetailsViewProps {
  onEdit: () => void;
}

export default function PayoutDetailsView({ onEdit }: PayoutDetailsViewProps) {
  const { data: wallet, isLoading, isError, refetch } = useWallet();
  const updateMutation = useUpdatePayoutDetails();

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          Loading payout details...
        </CardContent>
      </Card>
    );
  }

  if (isError || !wallet) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          Failed to load payout details.{" "}
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

  const pd = wallet.payoutDetails;
  const isComplete = hasCompletePayoutDetails(pd);
  const showUpi = hasUpiData(pd);
  const showBank = hasBankData(pd);
  const hasAnyData = showUpi || showBank;
  const activePrimary =
    pd?.primaryMethod ?? resolvePrimaryMethod(pd) ?? undefined;

  const setPrimaryMethod = (method: PayoutMethod) => {
    if (method === activePrimary || updateMutation.isPending) return;
    updateMutation.mutate({ primaryMethod: method });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div>
          <CardTitle>Payout details</CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">
            Required before requesting a withdrawal.
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Badge variant={isComplete ? "default" : "secondary"}>
            {isComplete ? "Complete" : "Incomplete"}
          </Badge>
          <Button type="button" variant="outline" size="sm" onClick={onEdit}>
            {hasAnyData ? "Edit" : "Add payout details"}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {!hasAnyData ? (
          <p className="text-sm text-muted-foreground">
            No payout details saved yet. Add your bank account or UPI ID to
            receive withdrawals.
          </p>
        ) : (
          <>
            <div className="rounded-lg border bg-muted/30 p-3 text-sm text-muted-foreground">
              Your preferred payout method is only a reference for our team. We
              will try your preferred method first; if it fails, we may pay via
              your other saved method. Your preference does not guarantee
              payment only through that method.
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-900">
                Preferred payout method
              </p>
              <div className="flex flex-wrap items-center gap-2">
                {(["bank", "upi"] as const).map((method) => {
                  const isCompleteMethod =
                    method === "upi"
                      ? hasCompleteUpiDetails(pd)
                      : hasCompleteBankDetails(pd);
                  const isActive = activePrimary === method;

                  return (
                    <button
                      key={method}
                      type="button"
                      disabled={!isCompleteMethod || updateMutation.isPending}
                      onClick={() => setPrimaryMethod(method)}
                      className={`rounded-full px-3 py-1 text-sm font-medium ring-1 disabled:cursor-not-allowed disabled:opacity-50 ${
                        isActive
                          ? "bg-emerald-600 text-white ring-emerald-600"
                          : "bg-white text-gray-700 ring-gray-200"
                      }`}
                    >
                      {payoutMethodLabel(method)}
                    </button>
                  );
                })}
                {updateMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin text-emerald-600" />
                ) : null}
              </div>
              {!hasCompleteBankDetails(pd) || !hasCompleteUpiDetails(pd) ? (
                <p className="text-xs text-muted-foreground">
                  Complete both methods to choose either as your preference.
                  Incomplete methods cannot be set as preferred.
                </p>
              ) : null}
            </div>

            {showUpi ? (
              <div className="rounded-lg bg-gray-50 p-4 text-sm">
                <p className="font-medium text-gray-900">UPI</p>
                <p className="mt-2 text-muted-foreground">
                  UPI ID: {pd?.upiId ?? "-"}
                </p>
              </div>
            ) : null}

            {showBank ? (
              <div className="rounded-lg bg-gray-50 p-4 text-sm">
                <p className="font-medium text-gray-900">Bank account</p>
                <div className="mt-2 space-y-1 text-muted-foreground">
                  {pd?.accountHolderName ? (
                    <p>{pd.accountHolderName}</p>
                  ) : null}
                  {pd?.bankName ? <p>{pd.bankName}</p> : null}
                  {pd?.accountNumber ? (
                    <p>Account: {pd.accountNumber}</p>
                  ) : null}
                  {pd?.ifscCode ? <p>IFSC: {pd.ifscCode}</p> : null}
                </div>
              </div>
            ) : null}
          </>
        )}
      </CardContent>
    </Card>
  );
}
