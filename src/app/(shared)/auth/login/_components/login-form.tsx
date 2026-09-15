"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { InputWithIcon } from "@/components/ui/input-with-icon";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { useLogin, useVerifyLoginOtp } from "@/lib/hooks/auth";
import { ROUTE_POINT } from "@/lib/constants/route-point";
import {
  loginSchema,
  verifyLoginOtpSchema,
  type LoginFormData,
  type VerifyLoginOtpFormData,
  type VerifyLoginOtpPayload,
} from "@/lib/schemas/auth";
import {
  isAuthOtpChallenge,
  type AuthOtpChallengeResponse,
} from "@/types/auth";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Eye, EyeOff, KeyRound, Lock, User } from "lucide-react";
import Link from "next/link";
import GoogleLoginButton from "@/components/auth/GoogleLoginButton";
import { getErrorMessage } from "@/lib/utils";

export default function LoginForm() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect");
  const safeRedirect =
    redirectTo?.startsWith("/") && !redirectTo.startsWith("//")
      ? redirectTo
      : undefined;

  const [showPassword, setShowPassword] = useState(false);
  const [otpChallenge, setOtpChallenge] =
    useState<AuthOtpChallengeResponse | null>(null);
  const loginMutation = useLogin(safeRedirect);
  const verifyOtpMutation = useVerifyLoginOtp(safeRedirect);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const otpForm = useForm<VerifyLoginOtpFormData>({
    resolver: zodResolver(verifyLoginOtpSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const result = await loginMutation.mutateAsync(data);
      if (isAuthOtpChallenge(result)) {
        setOtpChallenge(result);
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const onVerifyOtp = async (data: VerifyLoginOtpFormData) => {
    if (!otpChallenge) return;
    try {
      const payload: VerifyLoginOtpPayload = {
        otp: data.otp,
        ...(otpChallenge.phone
          ? { phone: otpChallenge.phone }
          : { email: otpChallenge.email! }),
      };
      await verifyOtpMutation.mutateAsync(payload);
    } catch (error) {
      console.error("OTP verification failed:", error);
    }
  };

  const otpDestination =
    otpChallenge?.email ?? otpChallenge?.phone ?? "";
  const channelLabel = otpChallenge?.channel === "sms" ? "phone" : "email";

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Welcome Back</CardTitle>
        <CardDescription>
          Sign in to your account to book amazing sports venues
        </CardDescription>
      </CardHeader>
      <CardContent>
        {otpChallenge ? (
          <form
            onSubmit={otpForm.handleSubmit(onVerifyOtp)}
            className="space-y-4"
          >
            <p className="text-sm text-gray-600">
              Two-factor authentication is enabled. Enter the code sent to your{" "}
              {channelLabel}{" "}
              <span className="font-medium">{otpDestination}</span>.
            </p>
            <div className="space-y-2">
              <Label htmlFor="otp">Verification code</Label>
              <InputWithIcon
                id="otp"
                icon={KeyRound}
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="6-digit code"
                {...otpForm.register("otp")}
              />
              {otpForm.formState.errors.otp && (
                <p className="text-sm text-red-600">
                  {otpForm.formState.errors.otp.message}
                </p>
              )}
            </div>
            {verifyOtpMutation.error && (
              <div className="text-sm text-red-600">
                {getErrorMessage(
                  verifyOtpMutation.error,
                  "Verification failed. Please try again.",
                )}
              </div>
            )}
            <Button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white cursor-pointer"
              disabled={verifyOtpMutation.isPending}
            >
              {verifyOtpMutation.isPending ? "Verifying..." : "Verify & Sign In"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={() => {
                setOtpChallenge(null);
                otpForm.reset();
              }}
            >
              Back to login
            </Button>
          </form>
        ) : (
          <>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="identifier">Email or phone</Label>
                <InputWithIcon
                  id="identifier"
                  icon={User}
                  type="text"
                  placeholder="you@email.com or +919876543210"
                  autoComplete="username"
                  {...register("identifier")}
                />
                {errors.identifier && (
                  <p className="text-sm text-red-600">
                    {errors.identifier.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <InputWithIcon
                  id="password"
                  icon={Lock}
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  endAdornment={
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  }
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>

              {loginMutation.error && (
                <div className="text-sm text-red-600">
                  {getErrorMessage(
                    loginMutation.error,
                    "Login failed. Please check your credentials.",
                  )}
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white cursor-pointer"
                disabled={isSubmitting || loginMutation.isPending}
              >
                {loginMutation.isPending ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            <GoogleLoginButton />

            <div className="mt-4 text-center">
              <Link
                href={ROUTE_POINT.auth.forgotPassword}
                className="text-sm text-blue-600 hover:underline"
              >
                Forgot your password?
              </Link>
            </div>

            <div className="mt-6 text-center text-sm">
              <span className="text-gray-600">Don&apos;t have an account? </span>
              <Link
                href={ROUTE_POINT.auth.register}
                className="text-blue-600 hover:underline"
              >
                Create one
              </Link>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
