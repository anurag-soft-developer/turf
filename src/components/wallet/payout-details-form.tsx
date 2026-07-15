"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InputWithIcon } from "@/components/ui/input-with-icon";
import { Label } from "@/components/ui/label";
import {
  useWallet,
  useUpdatePayoutDetails,
} from "@/modules/host/hooks/use-wallet";
import {
  payoutDetailsFormSchema,
  resolvePrimaryMethod,
  type PayoutDetailsFormData,
} from "@/modules/host/schemas/wallet-form";
import type { PayoutMethod } from "@/types/wallet";
import { zodResolver } from "@hookform/resolvers/zod";
import { Landmark, Loader2, Smartphone, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

interface PayoutDetailsFormProps {
  onSaved: () => void;
  onCancel: () => void;
}

export default function PayoutDetailsForm({
  onSaved,
  onCancel,
}: PayoutDetailsFormProps) {
  const { data: wallet } = useWallet();
  const updateMutation = useUpdatePayoutDetails();
  const initialType =
    resolvePrimaryMethod(wallet?.payoutDetails) ??
    wallet?.payoutDetails?.primaryMethod ??
    "bank";
  const [payoutType, setPayoutType] = useState<PayoutMethod>(initialType);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PayoutDetailsFormData>({
    resolver: zodResolver(payoutDetailsFormSchema),
    defaultValues:
      initialType === "upi"
        ? { payoutType: "upi", upiId: wallet?.payoutDetails?.upiId ?? "" }
        : {
            payoutType: "bank",
            accountHolderName: wallet?.payoutDetails?.accountHolderName ?? "",
            bankName: wallet?.payoutDetails?.bankName ?? "",
            accountNumber: wallet?.payoutDetails?.accountNumber ?? "",
            ifscCode: wallet?.payoutDetails?.ifscCode ?? "",
          },
  });

  useEffect(() => {
    const type =
      resolvePrimaryMethod(wallet?.payoutDetails) ??
      wallet?.payoutDetails?.primaryMethod ??
      "bank";
    setPayoutType(type);
    const pd = wallet?.payoutDetails;
    if (type === "upi") {
      reset({
        payoutType: "upi",
        upiId: pd?.upiId ?? "",
      });
    } else {
      reset({
        payoutType: "bank",
        accountHolderName: pd?.accountHolderName ?? "",
        bankName: pd?.bankName ?? "",
        accountNumber: pd?.accountNumber ?? "",
        ifscCode: pd?.ifscCode ?? "",
      });
    }
  }, [wallet, reset]);

  const onSubmit = handleSubmit(async (data) => {
    const payload =
      data.payoutType === "upi"
        ? { primaryMethod: "upi" as const, upiId: data.upiId }
        : {
            primaryMethod: "bank" as const,
            accountHolderName: data.accountHolderName,
            bankName: data.bankName,
            accountNumber: data.accountNumber,
            ifscCode: data.ifscCode,
          };
    await updateMutation.mutateAsync(payload);
    onSaved();
  });

  const switchType = (type: PayoutMethod) => {
    setPayoutType(type);
    const pd = wallet?.payoutDetails;
    if (type === "upi") {
      reset({
        payoutType: "upi",
        upiId: pd?.upiId ?? "",
      });
    } else {
      reset({
        payoutType: "bank",
        accountHolderName: pd?.accountHolderName ?? "",
        bankName: pd?.bankName ?? "",
        accountNumber: pd?.accountNumber ?? "",
        ifscCode: pd?.ifscCode ?? "",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit payout details</CardTitle>
        <p className="text-sm text-muted-foreground">
          Choose your preferred payout method and enter the details.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="rounded-lg border bg-muted/30 p-3 text-sm text-muted-foreground">
          Your preferred method is a reference only. Our team will try it first
          but may use your other saved method if needed.
        </p>
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
                <InputWithIcon
                  id="accountHolderName"
                  icon={User}
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
                <InputWithIcon
                  id="bankName"
                  icon={Landmark}
                  {...register("bankName")}
                />
                {"bankName" in errors && errors.bankName ? (
                  <p className="text-sm text-destructive">
                    {errors.bankName.message}
                  </p>
                ) : null}
              </div>
              <div className="space-y-2">
                <Label htmlFor="accountNumber">Account number</Label>
                <InputWithIcon
                  id="accountNumber"
                  icon={Landmark}
                  {...register("accountNumber")}
                />
                {"accountNumber" in errors && errors.accountNumber ? (
                  <p className="text-sm text-destructive">
                    {errors.accountNumber.message}
                  </p>
                ) : null}
              </div>
              <div className="space-y-2">
                <Label htmlFor="ifscCode">IFSC code</Label>
                <InputWithIcon
                  id="ifscCode"
                  icon={Landmark}
                  {...register("ifscCode")}
                />
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
              <InputWithIcon
                id="upiId"
                icon={Smartphone}
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

          <div className="flex flex-wrap gap-2">
            <Button type="submit" disabled={updateMutation.isPending}>
              {updateMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save payout details"
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={updateMutation.isPending}
              onClick={onCancel}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
