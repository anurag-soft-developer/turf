"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { Loader2, TicketCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ROUTE_POINT } from "@/lib/constants/route-point";
import { getErrorMessage } from "@/lib/utils";
import { useAuthStatus, useProfile } from "@/lib/hooks/auth";
import { useCreateEventBookingOrder } from "@/modules/event-bookings/hooks/use-event-booking-mutations";
import { useMyEventBooking } from "@/modules/event-bookings/hooks/use-my-event-booking";
import type { HostEvent } from "@/modules/host/types/event";

interface EventRegistrationSectionProps {
  event: HostEvent;
}

export default function EventRegistrationSection({
  event,
}: EventRegistrationSectionProps) {
  const params = useParams<{ slug: string }>();

  const { isAuthenticated, isLoading: isAuthLoading } = useAuthStatus();

  const { data: profile } = useProfile();

  const {
    data: myBooking,
    isLoading: isBookingLoading,
    refetch: refetchBooking,
  } = useMyEventBooking(event._id, isAuthenticated);

  const createOrderMutation = useCreateEventBookingOrder(event._id);

  const [modalOpen, setModalOpen] = useState(false);
  const [fullName, setFullName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const spotsLeft = Math.max(event.maxParticipants - event.registeredCount, 0);
  const registrationClosed =
    event.registrationsPaused || event.isClosed || spotsLeft <= 0;

  const loginHref = ROUTE_POINT.auth.loginWithRedirect(
    ROUTE_POINT.eventDetail(params.slug),
  );

  const handleRegister = async () => {
    setFormError(null);

    const trimmedName = fullName.trim() || profile?.fullName?.trim() || "";
    const trimmedContact = contactNumber.trim() || profile?.phone?.trim() || "";

    if (!trimmedName) {
      setFormError("Full name is required.");
      return;
    }

    if (!trimmedContact) {
      setFormError("Contact number is required.");
      return;
    }

    try {
      const result = await createOrderMutation.mutateAsync({
        fullName: trimmedName,
        contactNumber: trimmedContact,
        playerCount: 1,
      });

      if (result.paymentLink?.shortUrl) {
        window.location.href = result.paymentLink.shortUrl;
        return;
      }

      setModalOpen(false);
      await refetchBooking();
    } catch (error) {
      setFormError(getErrorMessage(error, "Registration failed. Please try again."));
    }
  };

  const handleContinuePayment = () => {
    const shortUrl = myBooking?.razorpayPaymentLinkShortUrl;
    if (shortUrl) {
      window.location.href = shortUrl;
    }
  };

  const handleOpenModal = () => {
    setFormError(null);
    setModalOpen(true);
  };

  if (isAuthenticated && isBookingLoading) {
    return (
      <div className="flex items-center justify-center rounded-xl border bg-card px-6 py-5">
        <Loader2 className="h-5 w-5 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (
    isAuthenticated &&
    myBooking &&
    (myBooking.status === "confirmed" || myBooking.status === "completed")
  ) {
    return (
      <div className="flex items-center justify-between gap-4 rounded-xl border border-emerald-200 bg-emerald-50 px-6 py-5">
        <div className="flex items-start gap-3">
          <TicketCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" />
          <div>
            <p className="font-semibold text-emerald-900">You are registered</p>
            <p className="text-sm text-emerald-800">
              {myBooking.bookingId ? `Booking ID: ${myBooking.bookingId}` : "Booking confirmed"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (
    isAuthenticated &&
    myBooking?.status === "pending" &&
    myBooking.paymentStatus === "pending"
  ) {
    return (
      <div className="flex flex-col gap-3 rounded-xl border bg-card px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-semibold text-gray-900">Payment pending</p>
          <p className="text-sm text-muted-foreground">
            Your slot is held. Complete payment to confirm.
          </p>
        </div>
        <Button
          type="button"
          className="shrink-0 bg-emerald-600 hover:bg-emerald-700"
          onClick={handleContinuePayment}
          disabled={createOrderMutation.isPending}
        >
          {createOrderMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Preparing...
            </>
          ) : (
            "Complete payment"
          )}
        </Button>
      </div>
    );
  }

  if (registrationClosed) {
    return (
      <div className="rounded-xl border bg-muted/40 px-6 py-5">
        <p className="font-semibold text-gray-900">Registration closed</p>
        <p className="mt-1 text-sm text-muted-foreground">
          {event.isClosed
            ? "This event is closed."
            : event.registrationsPaused
              ? "Registrations are paused for this event."
              : "This event is at full capacity."}
        </p>
      </div>
    );
  }

  const defaultName = fullName || profile?.fullName || "";
  const defaultContact = contactNumber || profile?.phone || "";
  const payLabel =
    event.price > 0 ? `Pay ${event.currency} ${event.price}` : "Confirm booking";

  const showAuthLoading = isAuthLoading;

  return (
    <>
      <div className="flex flex-col gap-3 rounded-xl border bg-card px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-semibold text-gray-900">
            {spotsLeft} {spotsLeft === 1 ? "slot" : "slots"} left
          </p>
          <p className="text-sm text-muted-foreground">
            {event.price > 0
              ? `Entry fee ${event.currency} ${event.price}`
              : "Free entry"}
          </p>
        </div>

        {showAuthLoading ? (
          <Loader2 className="h-5 w-5 animate-spin text-emerald-600" />
        ) : isAuthenticated ? (
          <Button
            type="button"
            className="shrink-0 bg-emerald-600 hover:bg-emerald-700"
            onClick={handleOpenModal}
          >
            Book slot
          </Button>
        ) : (
          <Link href={loginHref}>
            <Button type="button" className="shrink-0 bg-emerald-600 hover:bg-emerald-700">
              Login to book
            </Button>
          </Link>
        )}
      </div>

      {isAuthenticated ? (
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Book your slot</DialogTitle>
              <DialogDescription>
                {event.price > 0
                  ? `Fill in your details to proceed to payment (${event.currency} ${event.price}).`
                  : "Fill in your details to confirm your free slot."}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 my-4">
              <div className="space-y-1.5">
                <Label htmlFor="fullName">Full name</Label>
                <Input
                  id="fullName"
                  value={defaultName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your full name"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="contactNumber">Contact number</Label>
                <Input
                  id="contactNumber"
                  value={defaultContact}
                  onChange={(e) => setContactNumber(e.target.value)}
                  placeholder="Phone number"
                />
              </div>

              {formError ? <p className="text-sm text-red-600">{formError}</p> : null}

              <DialogFooter className="mt-0 sm:justify-stretch">
                <DialogClose disabled={createOrderMutation.isPending}>Cancel</DialogClose>
                <Button
                  type="button"
                  className="bg-emerald-600 hover:bg-emerald-700"
                  onClick={() => void handleRegister()}
                  disabled={createOrderMutation.isPending}
                >
                  {createOrderMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    payLabel
                  )}
                </Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>
      ) : null}
    </>
  );
}
