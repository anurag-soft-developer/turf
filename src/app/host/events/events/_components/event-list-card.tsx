"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  eventRegistrationHoldBadgeClassName,
  eventRegistrationHoldLabel,
  eventStatusLabel,
  eventStatusVariant,
} from "@/lib/utils/event-display";
import type { HostEvent } from "@/modules/host/types/event";
import { format } from "date-fns";
import { CalendarDays } from "lucide-react";

function formatDate(value?: string) {
  if (!value) return "Date not set";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date not set";
  return format(date, "MMM d, yyyy");
}

interface EventListCardProps {
  event: HostEvent;
  onOpen: (id: string) => void;
}

export default function EventListCard({ event, onOpen }: EventListCardProps) {
  return (
    <button
      type="button"
      onClick={() => onOpen(event._id)}
      className="block w-full text-left"
    >
      <Card className="transition-shadow hover:shadow-md">
        <CardContent className="flex items-center gap-4 pt-4">
          {event.coverImages?.[0] ? (
            <img
              src={event.coverImages[0]}
              alt=""
              className="h-16 w-16 shrink-0 rounded-lg object-cover ring-1 ring-gray-200"
            />
          ) : (
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-gray-100 ring-1 ring-gray-200">
              <CalendarDays className="h-6 w-6 text-gray-400" />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-semibold text-gray-900">{event.title}</p>
              <Badge variant={eventStatusVariant(event.status)}>
                {eventStatusLabel(event.status)}
              </Badge>
              <Badge
                variant="outline"
                className={eventRegistrationHoldBadgeClassName(
                  event.registrationsPaused,
                )}
              >
                {eventRegistrationHoldLabel(event.registrationsPaused)}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-1">
              {event.location?.address}
            </p>
            {event.status === "rejected" && event.rejectionReason ? (
              <p className="mt-1 text-sm text-destructive line-clamp-1">
                {event.rejectionReason}
              </p>
            ) : null}
            <p className="mt-1 text-sm text-emerald-700">
              {formatDate(event.eventDate)} • {event.currency} {event.price}
            </p>
          </div>
        </CardContent>
      </Card>
    </button>
  );
}
