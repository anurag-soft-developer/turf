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
  const [step, setStep] = useState<"email" | "reset">("email");
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const forgotMutation = useForgotPassword();
  const resetMutation = useResetPassword();

  const emailForm = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const resetForm = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { email: "" },
  });

  const onRequestOtp = async (data: ForgotPasswordFormData) => {
    try {
      const result = await forgotMutation.mutateAsync(data.email);
      setEmail(data.email);
      resetForm.setValue("email", data.email);
      setStep("reset");
      setSuccessMessage(result.message);
    } catch {
      // error shown via mutation state
    }
  };

  const onResetPassword = async (data: ResetPasswordFormData) => {
    try {
      const result = await resetMutation.mutateAsync(data);
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
          {step === "email" ? "Forgot password" : "Reset password"}
        </CardTitle>
        <CardDescription>
          {step === "email"
            ? "Enter your email and we will send a 6-digit reset code."
            : `Enter the code sent to ${email} and choose a new password.`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {step === "email" ? (
          <form
            onSubmit={emailForm.handleSubmit(onRequestOtp)}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                {...emailForm.register("email")}
              />
              {emailForm.formState.errors.email && (
                <p className="text-sm text-red-600">
                  {emailForm.formState.errors.email.message}
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
            <input type="hidden" {...resetForm.register("email")} />

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
              disabled={forgotMutation.isPending}
              onClick={() => forgotMutation.mutate(email)}
            >
              Resend code
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => {
                setStep("email");
                setSuccessMessage(null);
              }}
            >
              Use a different email
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
