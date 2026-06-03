"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatInr } from "@/lib/utils/currency";
import { useWallet } from "@/modules/host/hooks/use-wallet";
import { useCreateWithdrawal } from "@/modules/host/hooks/use-withdrawals";
import {
  hasCompletePayoutDetails,
  withdrawalRequestFormSchema,
  type WithdrawalRequestFormData,
} from "@/modules/host/schemas/wallet-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { isAxiosError } from "axios";

export default function RequestWithdrawalForm({
  onGoToPayout,
}: {
  onGoToPayout?: () => void;
}) {
  const { data: wallet } = useWallet();
  const createMutation = useCreateWithdrawal();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<WithdrawalRequestFormData>({
    resolver: zodResolver(withdrawalRequestFormSchema),
  });

  const amount = watch("amount");
  const available = wallet?.availableBalance ?? 0;
  const payoutComplete = hasCompletePayoutDetails(wallet?.payoutDetails);
  const amountNum = Number(amount) || 0;
  const exceedsBalance = amountNum > available;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await createMutation.mutateAsync({ amount: data.amount });
      reset();
    } catch {
      // error shown below
    }
  });

  const apiError =
    createMutation.isError && isAxiosError(createMutation.error)
      ? (createMutation.error.response?.data as { message?: string })?.message
      : createMutation.isError
        ? "Failed to submit withdrawal request."
        : null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Request withdrawal</CardTitle>
        <p className="text-sm text-muted-foreground">
          Available: {formatInr(available)}
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="flex flex-wrap items-end gap-4">
          <div className="min-w-[200px] flex-1 space-y-2">
            <Label htmlFor="amount">Amount (₹)</Label>
            <Input
              id="amount"
              type="number"
              min={1}
              step={1}
              placeholder="Enter amount"
              {...register("amount", { valueAsNumber: true })}
            />
            {errors.amount ? (
              <p className="text-sm text-destructive">{errors.amount.message}</p>
            ) : exceedsBalance ? (
              <p className="text-sm text-destructive">
                Amount exceeds available balance
              </p>
            ) : null}
          </div>
          <Button
            type="submit"
            disabled={
              !payoutComplete ||
              createMutation.isPending ||
              exceedsBalance ||
              amountNum < 1
            }
          >
            {createMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting…
              </>
            ) : (
              "Request withdrawal"
            )}
          </Button>
        </form>
        {!payoutComplete ? (
          <p className="mt-3 text-sm text-amber-600">
            Complete payout details before requesting a withdrawal.{" "}
            {onGoToPayout ? (
              <button
                type="button"
                className="font-medium underline"
                onClick={onGoToPayout}
              >
                Go to Payout details
              </button>
            ) : null}
          </p>
        ) : null}
        {apiError ? (
          <p className="mt-3 text-sm text-destructive">{apiError}</p>
        ) : null}
      </CardContent>
    </Card>
  );
}
