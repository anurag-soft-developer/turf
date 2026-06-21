"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  useProfile,
  useSendVerificationEmail,
  useVerifyEmail,
} from "@/lib/hooks/auth";
import { ROUTE_POINT } from "@/lib/constants/route-point";
import { CheckCircle, Mail, Loader2, AlertCircle } from "lucide-react";

const Page = () => {
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);

  const {
    data: user,
    isLoading: isProfileLoading,
    error: profileError,
  } = useProfile();
  const sendVerificationEmail = useSendVerificationEmail();
  const verifyEmail = useVerifyEmail();
  const { email } = user || {};

  const isEmailVerified = user?.isEmailVerified || false;

  useEffect(() => {
    if (
      !isEmailVerified &&
      !isOtpSent &&
      email &&
      sendVerificationEmail.isIdle
    ) {
      sendVerificationEmail.mutate(email, {
        onSuccess: () => {
          setIsOtpSent(true);
        },
      });
    }
  }, [isEmailVerified, isOtpSent, email]);

  // Handle OTP verification
  const handleVerifyOtp = () => {
    if (!otp.trim() || !email) return;

    verifyEmail.mutate({
      otp: otp,
      email: email,
    });
  };

  // Handle resend OTP
  const handleResendOtp = () => {
    if (!email) return;

    sendVerificationEmail.mutate(email, {
      onSuccess: () => {
        setOtp("");
      },
    });
  };

  // Loading state while checking profile
  if (isProfileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex items-center justify-center p-6">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2">Loading...</span>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state
  if (profileError || !email) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <CardTitle>Verification Error</CardTitle>
            <CardDescription>
              {profileError
                ? "Failed to load user profile."
                : "Email address is missing."}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  // Already verified state
  if (isEmailVerified) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <CardTitle>Email Already Verified</CardTitle>
            <CardDescription>
              Your email address has already been verified. You can now access
              all features.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => (window.location.href = ROUTE_POINT.events)}
              className="w-full"
            >
              Go to Events
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Main verification flow
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Mail className="h-12 w-12 text-primary mx-auto mb-4" />
          <CardTitle>Verify Your Email</CardTitle>
          <CardDescription>
            {!isOtpSent
              ? "We're sending a verification code to your email address."
              : `We've sent a verification code to ${email}`}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Sending OTP state */}
          {!isOtpSent && sendVerificationEmail.isPending && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-sm">Sending verification code...</span>
            </div>
          )}

          {/* Send OTP error */}
          {sendVerificationEmail.isError && (
            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-sm text-destructive text-center">
                Failed to send verification email. Please try again.
              </p>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => sendVerificationEmail.mutate(email)}
                className="w-full mt-2"
                disabled={sendVerificationEmail.isPending}
              >
                {sendVerificationEmail.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Sending...
                  </>
                ) : (
                  "Try Again"
                )}
              </Button>
            </div>
          )}

          {/* OTP Input Form */}
          {isOtpSent && !sendVerificationEmail.isError && (
            <div className="space-y-4">
              <div>
                <Label className="pb-2" htmlFor="otp">
                  Verification Code
                </Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="Enter 6-digit code"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={6}
                  className="text-center text-lg tracking-wider"
                />
              </div>

              {/* Verify error */}
              {verifyEmail.isError && (
                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <p className="text-sm text-destructive text-center">
                    Invalid or expired verification code. Please try again.
                  </p>
                </div>
              )}

              <Button
                onClick={handleVerifyOtp}
                disabled={!otp.trim() || verifyEmail.isPending}
                className="w-full"
              >
                {verifyEmail.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Verifying...
                  </>
                ) : (
                  "Verify Email"
                )}
              </Button>

              {/* Resend OTP */}
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">
                  Didn't receive the code?
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleResendOtp}
                  disabled={sendVerificationEmail.isPending}
                >
                  {sendVerificationEmail.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Resending...
                    </>
                  ) : (
                    "Resend Code"
                  )}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
