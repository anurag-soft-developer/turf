"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { maskAccountNumber, maskUpiId } from "@/lib/utils/payout-mask";
import {
  useWallet,
  useUpdatePayoutDetails,
} from "@/modules/host/hooks/use-wallet";
import {
  hasCompletePayoutDetails,
  payoutDetailsFormSchema,
  type PayoutDetailsFormData,
} from "@/modules/host/schemas/wallet-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function PayoutDetailsForm() {
  const { data: wallet } = useWallet();
  const updateMutation = useUpdatePayoutDetails();
  const [payoutType, setPayoutType] = useState<"bank" | "upi">("bank");
  const [saved, setSaved] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<PayoutDetailsFormData>({
    resolver: zodResolver(payoutDetailsFormSchema),
    defaultValues: { ...wallet?.payoutDetails, payoutType: "bank" },
  });

  const onSubmit = handleSubmit(async (data) => {
    setSaved(false);
    const payload =
      data.payoutType === "upi"
        ? { upiId: data.upiId }
        : {
            accountHolderName: data.accountHolderName,
            bankName: data.bankName,
            accountNumber: data.accountNumber,
            ifscCode: data.ifscCode,
          };
    await updateMutation.mutateAsync(payload);
    setSaved(true);
  });

  const switchType = (type: "bank" | "upi") => {
    setPayoutType(type);
    setValue("payoutType", type);
  };

  const pd = wallet?.payoutDetails;
  const isComplete = hasCompletePayoutDetails(pd);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payout details</CardTitle>
        <p className="text-sm text-muted-foreground">
          Required before requesting a withdrawal.
          {isComplete ? (
            <span className="ml-1 text-emerald-600">Complete</span>
          ) : (
            <span className="ml-1 text-amber-600">Incomplete</span>
          )}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {isComplete && pd ? (
          <div className="rounded-lg bg-gray-50 p-3 text-sm text-muted-foreground">
            <p>{pd.accountHolderName}</p>
            <p>{pd.bankName}</p>
            <p>Account: {maskAccountNumber(pd.accountNumber)}</p>
            <p>IFSC: {pd.ifscCode}</p>
            <p>UPI: {maskUpiId(pd.upiId)}</p>
          </div>
        ) : null}

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => switchType("bank")}
            className={`rounded-full px-3 py-1 text-sm font-medium ring-1 ${
              payoutType === "bank"
                ? "bg-emerald-600 text-white ring-emerald-600"
                : "bg-white text-gray-700 ring-gray-200"
            }`}
          >
            Bank account
          </button>
          <button
            type="button"
            onClick={() => switchType("upi")}
            className={`rounded-full px-3 py-1 text-sm font-medium ring-1 ${
              payoutType === "upi"
                ? "bg-emerald-600 text-white ring-emerald-600"
                : "bg-white text-gray-700 ring-gray-200"
            }`}
          >
            UPI
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          {payoutType === "bank" ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="accountHolderName">Account holder name</Label>
                <Input
                  id="accountHolderName"
                  {...register("accountHolderName")}
                />
                {"accountHolderName" in errors && errors.accountHolderName ? (
                  <p className="text-sm text-destructive">
                    {errors.accountHolderName.message}
                  </p>
                ) : null}
              </div>
              <div className="space-y-2">
                <Label htmlFor="bankName">Bank name</Label>
                <Input id="bankName" {...register("bankName")} />
                {"bankName" in errors && errors.bankName ? (
                  <p className="text-sm text-destructive">
                    {errors.bankName.message}
                  </p>
                ) : null}
              </div>
              <div className="space-y-2">
                <Label htmlFor="accountNumber">Account number</Label>
                <Input id="accountNumber" {...register("accountNumber")} />
                {"accountNumber" in errors && errors.accountNumber ? (
                  <p className="text-sm text-destructive">
                    {errors.accountNumber.message}
                  </p>
                ) : null}
              </div>
              <div className="space-y-2">
                <Label htmlFor="ifscCode">IFSC code</Label>
                <Input id="ifscCode" {...register("ifscCode")} />
                {"ifscCode" in errors && errors.ifscCode ? (
                  <p className="text-sm text-destructive">
                    {errors.ifscCode.message}
                  </p>
                ) : null}
              </div>
            </>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="upiId">UPI ID</Label>
              <Input
                id="upiId"
                placeholder="name@bank"
                {...register("upiId")}
              />
              {"upiId" in errors && errors.upiId ? (
                <p className="text-sm text-destructive">
                  {errors.upiId.message}
                </p>
              ) : null}
            </div>
          )}

          {updateMutation.isError ? (
            <p className="text-sm text-destructive">
              Failed to save payout details. Please try again.
            </p>
          ) : null}
          {saved ? (
            <p className="text-sm text-emerald-600">Payout details saved.</p>
          ) : null}

          <Button type="submit" disabled={updateMutation.isPending}>
            {updateMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving…
              </>
            ) : (
              "Save payout details"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
