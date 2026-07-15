"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  turfBookingHoldBadgeClassName,
  turfBookingHoldLabel,
  turfStatusLabel,
  turfStatusVariant,
} from "@/lib/utils/turf-display";
import type { Turf } from "@/modules/host/types/turf";
import { MapPin } from "lucide-react";

interface TurfListCardProps {
  turf: Turf;
  onOpen: (id: string) => void;
}

export default function TurfListCard({ turf, onOpen }: TurfListCardProps) {
  return (
    <button
      type="button"
      onClick={() => onOpen(turf._id)}
      className="block w-full text-left"
    >
      <Card className="transition-shadow hover:shadow-md">
        <CardContent className="flex items-center gap-4 pt-4">
          {turf.images?.[0] ? (
            <img
              src={turf.images[0]}
              alt=""
              className="h-16 w-16 shrink-0 rounded-lg object-cover ring-1 ring-gray-200"
            />
          ) : (
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-gray-100 ring-1 ring-gray-200">
              <MapPin className="h-6 w-6 text-gray-400" />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-semibold text-gray-900">{turf?.name}</p>
              <Badge variant={turfStatusVariant(turf?.status)}>
                {turfStatusLabel(turf?.status)}
              </Badge>
              <Badge
                variant="outline"
                className={turfBookingHoldBadgeClassName(turf.isAvailable)}
              >
                {turfBookingHoldLabel(turf.isAvailable)}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-1">
              {turf?.location?.address}
            </p>
            {turf?.status === "rejected" && turf.rejectionReason ? (
              <p className="mt-1 text-sm text-destructive line-clamp-1">
                {turf.rejectionReason}
              </p>
            ) : null}
            <p className="mt-1 text-sm text-emerald-700">
              ₹{turf?.pricing?.basePricePerHour}/hr
            </p>
          </div>
        </CardContent>
      </Card>
    </button>
  );
}
