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
import {
  changePasswordSchema,
  type ChangePasswordFormData,
} from "@/lib/schemas/auth";
import {
  useChangePassword,
  useProfile,
  useSendChangePasswordOtp,
} from "@/lib/hooks/auth";
import { getErrorMessage } from "@/lib/utils";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export default function ChangePasswordForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { data: user } = useProfile();
  const changePassword = useChangePassword();
  const sendOtp = useSendChangePasswordOtp();

  const needsOtp = !user?.isPasswordExists || user?.twoFactorEnabled;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit = async (data: ChangePasswordFormData) => {
    try {
      const result = await changePassword.mutateAsync(data);
      setSuccessMessage(result.message);
      reset();
    } catch {
      // shown via mutation
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Change password</CardTitle>
        <CardDescription>
          {user?.isPasswordExists
            ? user.twoFactorEnabled
              ? "Enter your current password and the OTP sent to your email."
              : "Enter your current password and a new password."
            : "Your account uses Google sign-in. Request an OTP to set a password."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {successMessage ? (
          <p className="text-sm text-green-600">{successMessage}</p>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {user?.isPasswordExists && (
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current password</Label>
                <Input
                  id="currentPassword"
                  type={showPassword ? "text" : "password"}
                  {...register("currentPassword")}
                />
                {errors.currentPassword && (
                  <p className="text-sm text-red-600">
                    {errors.currentPassword.message}
                  </p>
                )}
              </div>
            )}

            {needsOtp && (
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
                    {sendOtp.isPending ? "Sending…" : "Send OTP"}
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
            )}

            <div className="space-y-2">
              <Label htmlFor="newPassword">New password</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showPassword ? "text" : "password"}
                  {...register("newPassword")}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1 h-6 w-6 p-0"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              {errors.newPassword && (
                <p className="text-sm text-red-600">
                  {errors.newPassword.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm new password</Label>
              <Input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                {...register("confirmPassword")}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-600">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {changePassword.error && (
              <p className="text-sm text-red-600">
                {getErrorMessage(
                  changePassword.error,
                  "Could not change password.",
                )}
              </p>
            )}

            <Button
              type="submit"
              disabled={isSubmitting || changePassword.isPending}
            >
              {changePassword.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating…
                </>
              ) : (
                "Update password"
              )}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
