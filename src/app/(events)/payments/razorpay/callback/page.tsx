"use client";

import Link from "next/link";
import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, CheckCircle2, Loader2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ROUTE_POINT } from "@/lib/constants/route-point";
import { useAuthStatus } from "@/lib/hooks/auth";
import { getErrorMessage } from "@/lib/utils";
import { useVerifyEventHostedPayment } from "@/modules/event-bookings/hooks/use-event-booking-mutations";

type CallbackState = "loading" | "success" | "error";

export default function RazorpayPaymentCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-lg px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex justify-center py-10">
            <Loader2 className="h-10 w-10 animate-spin text-emerald-600" />
          </div>
        </div>
      }
    >
      <RazorpayPaymentCallbackContent />
    </Suspense>
  );
}

function RazorpayPaymentCallbackContent() {
  const searchParams = useSearchParams();
  const { data: authStatus, isLoading: isAuthLoading } = useAuthStatus();
  const verifyMutation = useVerifyEventHostedPayment(
    searchParams.get("eventId")?.trim() ?? "",
  );
  const hasVerified = useRef(false);

  const eventId = searchParams.get("eventId")?.trim() ?? "";
  const bookingId = searchParams.get("bookingId")?.trim() ?? "";
  const eventSlug = searchParams.get("eventSlug")?.trim() ?? "";
  const paymentLinkId = searchParams.get("razorpay_payment_link_id")?.trim() ?? "";
  const referenceId =
    searchParams.get("razorpay_payment_link_reference_id")?.trim() ?? "";
  const paymentLinkStatus =
    searchParams.get("razorpay_payment_link_status")?.trim() ?? "";
  const paymentId = searchParams.get("razorpay_payment_id")?.trim() ?? "";
  const signature = searchParams.get("razorpay_signature")?.trim() ?? "";

  const [state, setState] = useState<CallbackState>("loading");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [displayBookingId, setDisplayBookingId] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthLoading || hasVerified.current) {
      return;
    }

    if (!authStatus?.isAuthenticated) {
      setState("error");
      setErrorMessage("Please sign in to verify your payment.");
      return;
    }

    if (!eventId || !bookingId) {
      setState("error");
      setErrorMessage("Missing booking details.");
      return;
    }

    if (paymentLinkStatus !== "paid") {
      setState("error");
      setErrorMessage("Payment was not completed.");
      return;
    }

    if (!paymentLinkId || !referenceId || !paymentId || !signature) {
      setState("error");
      setErrorMessage("Missing payment verification details.");
      return;
    }

    hasVerified.current = true;

    verifyMutation
      .mutateAsync({
        bookingId,
        razorpay_payment_link_id: paymentLinkId,
        razorpay_payment_link_reference_id: referenceId,
        razorpay_payment_link_status: paymentLinkStatus,
        razorpay_payment_id: paymentId,
        razorpay_signature: signature,
      })
      .then((booking) => {
        setDisplayBookingId(booking.bookingId ?? null);
        setState("success");
      })
      .catch((error: unknown) => {
        setState("error");
        setErrorMessage(
          getErrorMessage(error, "Payment verification failed. Please try again."),
        );
      });
  }, [
    authStatus?.isAuthenticated,
    bookingId,
    eventId,
    isAuthLoading,
    paymentId,
    paymentLinkId,
    paymentLinkStatus,
    referenceId,
    signature,
    verifyMutation,
  ]);

  const backHref = eventSlug ? ROUTE_POINT.eventDetail(eventSlug) : ROUTE_POINT.events;

  return (
    <div className="mx-auto max-w-lg px-4 py-16 sm:px-6 lg:px-8">
      <Card>
        <CardContent className="py-10 text-center">
          {state === "loading" ? (
            <>
              <Loader2 className="mx-auto h-10 w-10 animate-spin text-emerald-600" />
              <p className="mt-4 text-sm text-muted-foreground">
                Verifying your payment...
              </p>
            </>
          ) : null}

          {state === "success" ? (
            <>
              <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-600" />
              <h1 className="mt-4 text-xl font-semibold text-gray-900">
                Registration confirmed
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Your payment was successful
                {displayBookingId ? ` (${displayBookingId})` : ""}.
              </p>
              <Link href={backHref}>
                <Button className="mt-6 bg-emerald-600 hover:bg-emerald-700">
                  Back to event
                </Button>
              </Link>
            </>
          ) : null}

          {state === "error" ? (
            <>
              <XCircle className="mx-auto h-10 w-10 text-red-500" />
              <h1 className="mt-4 text-xl font-semibold text-gray-900">
                Payment verification failed
              </h1>
              <p className="mt-2 text-sm text-red-600">{errorMessage}</p>
              <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
                <Link href={backHref}>
                  <Button variant="outline">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to event
                  </Button>
                </Link>
                {!authStatus?.isAuthenticated ? (
                  <Link href={ROUTE_POINT.auth.login}>
                    <Button className="bg-emerald-600 hover:bg-emerald-700">
                      Sign in
                    </Button>
                  </Link>
                ) : null}
              </div>
            </>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
