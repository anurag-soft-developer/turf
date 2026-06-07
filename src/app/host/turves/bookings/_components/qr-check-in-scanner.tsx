"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { hostBookingsApi } from "@/modules/host/api/bookings";
import { useCheckInBooking } from "@/modules/host/hooks/use-owner-bookings";
import { useCallback, useEffect, useRef, useState } from "react";

interface QrCheckInScannerProps {
  onClose?: () => void;
}

async function processCheckIn(
  bookingId: string,
  checkIn: ReturnType<typeof useCheckInBooking>,
) {
  const id = bookingId.trim();
  if (!id) throw new Error("Booking ID is required");

  const booking = await hostBookingsApi.getById(id);
  if (booking.status !== "confirmed") {
    throw new Error("Booking is not in confirmed status");
  }

  await checkIn.mutateAsync(id);
  return id;
}

export default function QrCheckInScanner({ onClose }: QrCheckInScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const scanLockRef = useRef(false);
  const [manualId, setManualId] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [cameraSupported, setCameraSupported] = useState(false);
  const checkInMutation = useCheckInBooking();

  const runCheckIn = useCallback(
    async (bookingId: string) => {
      if (scanLockRef.current) return;
      scanLockRef.current = true;
      setProcessing(true);
      setError(null);
      setMessage(null);
      try {
        const id = await processCheckIn(bookingId, checkInMutation);
        setMessage(`Check-in successful for booking ${id}`);
        streamRef.current?.getTracks().forEach((t) => t.stop());
      } catch (e) {
        setError(
          e instanceof Error ? e.message : "Invalid booking or check-in failed",
        );
        scanLockRef.current = false;
      } finally {
        setProcessing(false);
      }
    },
    [checkInMutation],
  );

  useEffect(() => {
    const BarcodeDetectorCtor =
      typeof window !== "undefined"
        ? (
            window as Window & {
              BarcodeDetector?: new () => {
                detect: (
                  source: ImageBitmapSource,
                ) => Promise<Array<{ rawValue: string }>>;
              };
            }
          ).BarcodeDetector
        : undefined;

    if (!BarcodeDetectorCtor || !videoRef.current) {
      setCameraSupported(false);
      return;
    }

    let cancelled = false;
    let intervalId: ReturnType<typeof setInterval> | undefined;
    const detector = new BarcodeDetectorCtor();

    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: "environment" } })
      .then((stream) => {
        if (cancelled || !videoRef.current) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        videoRef.current.srcObject = stream;
        void videoRef.current.play();
        setCameraSupported(true);

        intervalId = setInterval(async () => {
          if (
            cancelled ||
            scanLockRef.current ||
            !videoRef.current ||
            videoRef.current.readyState < 2
          ) {
            return;
          }
          try {
            const codes = await detector.detect(videoRef.current);
            const value = codes[0]?.rawValue;
            if (value) void runCheckIn(value);
          } catch {
            // ignore frame errors
          }
        }, 800);
      })
      .catch(() => {
        if (!cancelled) {
          setCameraSupported(false);
          setError(
            "Camera unavailable. Enter the booking ID manually or use HTTPS/localhost.",
          );
        }
      });

    return () => {
      cancelled = true;
      if (intervalId) clearInterval(intervalId);
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, [runCheckIn]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>QR check-in</CardTitle>
        {onClose ? (
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
        ) : null}
      </CardHeader>
      <CardContent className="space-y-4">
        {cameraSupported ? (
          <video
            ref={videoRef}
            className="min-h-[280px] w-full rounded-lg bg-black object-cover"
            muted
            playsInline
          />
        ) : (
          <p className="rounded-lg border bg-muted/30 p-4 text-sm text-muted-foreground">
            Live QR scanning needs a supported browser (e.g. Chrome) and camera
            permission. You can still check in with a booking ID below.
          </p>
        )}

        <div className="flex flex-col gap-2 sm:flex-row">
          <Input
            placeholder="Booking ID"
            value={manualId}
            onChange={(e) => setManualId(e.target.value)}
          />
          <Button
            type="button"
            disabled={processing || !manualId.trim()}
            onClick={() => void runCheckIn(manualId)}
          >
            Check in
          </Button>
        </div>

        {processing ? (
          <p className="text-sm text-muted-foreground">Processing…</p>
        ) : null}
        {message ? (
          <p className="text-sm font-medium text-emerald-700">{message}</p>
        ) : null}
        {error ? <p className="text-sm text-destructive">{error}</p> : null}
      </CardContent>
    </Card>
  );
}
