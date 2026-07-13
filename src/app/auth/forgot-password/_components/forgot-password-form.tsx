"use client";

import { useState } from "react";
import Link from "next/link";
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
  forgotPasswordSchema,
  resetPasswordSchema,
  toForgotPasswordPayload,
  type AuthContactPayload,
  type ForgotPasswordFormData,
  type ResetPasswordFormData,
} from "@/lib/schemas/auth";
import { ROUTE_POINT } from "@/lib/constants/route-point";
import { useForgotPassword, useResetPassword } from "@/lib/hooks/auth";
import { getErrorMessage } from "@/lib/utils";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ForgotPasswordForm() {
  const router = useRouter();
  const [step, setStep] = useState<"identifier" | "reset">("identifier");
  const [contact, setContact] = useState<AuthContactPayload | null>(null);
  const [destination, setDestination] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const forgotMutation = useForgotPassword();
  const resetMutation = useResetPassword();

  const identifierForm = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const resetForm = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onRequestOtp = async (data: ForgotPasswordFormData) => {
    try {
      const payload = toForgotPasswordPayload(data);
      const result = await forgotMutation.mutateAsync(payload);
      setContact(payload);
      setDestination(payload.email ?? payload.phone ?? data.identifier);
      setStep("reset");
      setSuccessMessage(result.message);
    } catch {
      // error shown via mutation state
    }
  };

  const onResetPassword = async (data: ResetPasswordFormData) => {
    if (!contact) return;
    try {
      const result = await resetMutation.mutateAsync({
        ...contact,
        otp: data.otp,
        password: data.password,
      });
      setSuccessMessage(result.message);
      setTimeout(() => router.push(ROUTE_POINT.auth.login), 1500);
    } catch {
      // error shown via mutation state
    }
  };

  if (successMessage && resetMutation.isSuccess) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Password reset</CardTitle>
          <CardDescription>{successMessage}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-center text-gray-600">
            Redirecting you to sign in…
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>
          {step === "identifier" ? "Forgot password" : "Reset password"}
        </CardTitle>
        <CardDescription>
          {step === "identifier"
            ? "Enter your email or phone and we will send a 6-digit reset code by email or SMS."
            : `Enter the code sent to ${destination} and choose a new password.`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {step === "identifier" ? (
          <form
            onSubmit={identifierForm.handleSubmit(onRequestOtp)}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="identifier">Email or phone</Label>
              <Input
                id="identifier"
                type="text"
                placeholder="you@email.com or +919876543210"
                {...identifierForm.register("identifier")}
              />
              {identifierForm.formState.errors.identifier && (
                <p className="text-sm text-red-600">
                  {identifierForm.formState.errors.identifier.message}
                </p>
              )}
            </div>

            {forgotMutation.error && (
              <p className="text-sm text-red-600">
                {getErrorMessage(
                  forgotMutation.error,
                  "Could not send reset code. Please try again.",
                )}
              </p>
            )}

            <Button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700"
              disabled={forgotMutation.isPending}
            >
              {forgotMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending…
                </>
              ) : (
                "Send reset code"
              )}
            </Button>
          </form>
        ) : (
          <form
            onSubmit={resetForm.handleSubmit(onResetPassword)}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="otp">Reset code</Label>
              <Input
                id="otp"
                inputMode="numeric"
                maxLength={6}
                placeholder="6-digit code"
                className="tracking-widest text-center"
                {...resetForm.register("otp")}
              />
              {resetForm.formState.errors.otp && (
                <p className="text-sm text-red-600">
                  {resetForm.formState.errors.otp.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">New password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="New password"
                  {...resetForm.register("password")}
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
              {resetForm.formState.errors.password && (
                <p className="text-sm text-red-600">
                  {resetForm.formState.errors.password.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm password</Label>
              <Input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                placeholder="Confirm new password"
                {...resetForm.register("confirmPassword")}
              />
              {resetForm.formState.errors.confirmPassword && (
                <p className="text-sm text-red-600">
                  {resetForm.formState.errors.confirmPassword.message}
                </p>
              )}
            </div>

            {resetMutation.error && (
              <p className="text-sm text-red-600">
                {getErrorMessage(
                  resetMutation.error,
                  "Could not reset password. Check the code and try again.",
                )}
              </p>
            )}

            <Button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700"
              disabled={resetMutation.isPending}
            >
              {resetMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Resetting…
                </>
              ) : (
                "Reset password"
              )}
            </Button>

            <Button
              type="button"
              variant="ghost"
              className="w-full"
              disabled={forgotMutation.isPending || !contact}
              onClick={() => contact && forgotMutation.mutate(contact)}
            >
              Resend code
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => {
                setStep("identifier");
                setContact(null);
                setSuccessMessage(null);
              }}
            >
              Use a different email or phone
            </Button>
          </form>
        )}

        <div className="mt-6 text-center text-sm">
          <Link href={ROUTE_POINT.auth.login} className="text-blue-600 hover:underline">
            Back to sign in
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
