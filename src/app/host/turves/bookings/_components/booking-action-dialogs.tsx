"use client";

import { Button } from "@/components/ui/button";
import {
  useCancelBooking,
  useCompleteBooking,
  useConfirmBooking,
} from "@/modules/host/hooks/use-owner-bookings";
import type { OwnerBooking } from "@/modules/host/types/owner-booking";
import { useState } from "react";

interface BookingActionsProps {
  booking: OwnerBooking;
}

export default function BookingActions({ booking }: BookingActionsProps) {
  const confirmMutation = useConfirmBooking();
  const completeMutation = useCompleteBooking();
  const cancelMutation = useCancelBooking();
  const [cancelReason, setCancelReason] = useState("");
  const [showCancel, setShowCancel] = useState(false);

  const isPending = booking.status === "pending";
  const isConfirmed = booking.status === "confirmed";

  return (
    <div className="flex flex-col gap-3">
      {(isPending || isConfirmed) && !showCancel ? (
        <div className="flex justify-end gap-2">
          {isPending ? (
            <Button
              size="sm"
              onClick={() => confirmMutation.mutate(booking._id)}
              disabled={confirmMutation.isPending}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              {confirmMutation.isPending ? "Confirming…" : "Confirm booking"}
            </Button>
          ) : null}
          {isConfirmed ? (
            <Button
              size="sm"
              onClick={() => completeMutation.mutate(booking._id)}
              disabled={completeMutation.isPending}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              {completeMutation.isPending ? "Completing…" : "Mark completed"}
            </Button>
          ) : null}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowCancel(true)}
            className="text-destructive hover:bg-destructive/5 hover:text-destructive"
          >
            Decline / cancel
          </Button>
        </div>
      ) : null}

      {showCancel ? (
        <div className="space-y-2 rounded-lg border p-3">
          <textarea
            className="w-full rounded-md border px-3 py-2 text-sm"
            placeholder="Reason for cancellation"
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            rows={3}
          />
          <div className="flex gap-2">
            <Button
              variant="destructive"
              size="sm"
              disabled={!cancelReason.trim() || cancelMutation.isPending}
              onClick={() =>
                cancelMutation.mutate({
                  id: booking._id,
                  reason: cancelReason.trim(),
                })
              }
            >
              Confirm cancel
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowCancel(false)}
            >
              Back
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
