"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  updateTwoFactorSchema,
  type UpdateTwoFactorFormData,
} from "@/lib/schemas/auth";
import {
  useProfile,
  useSendTwoFactorOtp,
  useUpdateTwoFactor,
} from "@/lib/hooks/auth";
import { getErrorMessage } from "@/lib/utils";
import { Loader2, Shield } from "lucide-react";

export default function TwoFactorSettingsForm() {
  const { data: user } = useProfile();
  const sendOtp = useSendTwoFactorOtp();
  const updateTwoFactor = useUpdateTwoFactor();
  const [pendingEnabled, setPendingEnabled] = useState<boolean | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<UpdateTwoFactorFormData>({
    resolver: zodResolver(updateTwoFactorSchema),
    defaultValues: { enabled: false, otp: "" },
  });

  const startToggle = (enabled: boolean) => {
    setPendingEnabled(enabled);
    setValue("enabled", enabled);
    reset({ enabled, otp: "" });
    sendOtp.mutate();
  };

  const onSubmit = async (data: UpdateTwoFactorFormData) => {
    try {
      await updateTwoFactor.mutateAsync(data);
      setPendingEnabled(null);
      reset({ enabled: data.enabled, otp: "" });
    } catch {
      // shown via mutation
    }
  };

  const isEnabled = user?.twoFactorEnabled ?? false;
  const showOtpForm = pendingEnabled !== null;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-600" />
              Two-factor authentication
            </CardTitle>
            <CardDescription className="mt-1">
              Require a one-time verification code when signing in.
            </CardDescription>
          </div>
          <Badge variant={isEnabled ? "default" : "secondary"}>
            {isEnabled ? "On" : "Off"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {!showOtpForm ? (
          <div className="flex flex-wrap gap-2">
            {!isEnabled ? (
              <Button type="button" onClick={() => startToggle(true)}>
                Enable 2FA
              </Button>
            ) : (
              <Button
                type="button"
                variant="outline"
                onClick={() => startToggle(false)}
              >
                Disable 2FA
              </Button>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <p className="text-sm text-gray-600">
              {pendingEnabled
                ? "Enter the verification code we sent you to enable 2FA."
                : "Enter the verification code we sent you to disable 2FA."}
            </p>

            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <Label htmlFor="otp">Verification code</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={sendOtp.isPending}
                  onClick={() => sendOtp.mutate()}
                >
                  {sendOtp.isPending ? "Sending…" : "Resend OTP"}
                </Button>
              </div>
              <Input
                id="otp"
                inputMode="numeric"
                maxLength={6}
                placeholder="6-digit code"
                {...register("otp")}
              />
              {sendOtp.isSuccess && (
                <p className="text-sm text-green-600">{sendOtp.data.message}</p>
              )}
              {errors.otp && (
                <p className="text-sm text-red-600">{errors.otp.message}</p>
              )}
            </div>

            {updateTwoFactor.error && (
              <p className="text-sm text-red-600">
                {getErrorMessage(
                  updateTwoFactor.error,
                  "Could not update two-factor settings.",
                )}
              </p>
            )}

            <div className="flex gap-2">
              <Button type="submit" disabled={updateTwoFactor.isPending}>
                {updateTwoFactor.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Confirming…
                  </>
                ) : pendingEnabled ? (
                  "Enable 2FA"
                ) : (
                  "Disable 2FA"
                )}
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setPendingEnabled(null);
                  reset();
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
