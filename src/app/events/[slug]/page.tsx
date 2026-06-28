"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { format, isBefore, startOfDay } from "date-fns";
import {
  ArrowLeft,
  CalendarDays,
  Clock,
  IndianRupee,
  Loader2,
  MapPin,
  UserRound,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ROUTE_POINT } from "@/lib/constants/route-point";
import { getGoogleMapsUrl } from "@/lib/maps/google-maps-url";
import { usePublicEvent } from "@/modules/public-events/hooks/use-public-event";
import EventRegistrationSection from "./_components/event-registration-section";

function isEventUpcoming(eventDate?: string) {
  if (!eventDate) return false;
  const date = new Date(eventDate);
  if (Number.isNaN(date.getTime())) return false;
  return !isBefore(startOfDay(date), startOfDay(new Date()));
}

function formatEventDate(value?: string) {
  if (!value) return "Date not set";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date not set";
  return format(date, "EEEE, MMMM d, yyyy");
}

function EventDetailStat({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2.5 rounded-lg border bg-card px-3 py-2.5">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-emerald-50 text-emerald-700">
        <Icon className="h-3.5 w-3.5" />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-medium text-muted-foreground">{label}</p>
        <p className="truncate text-sm font-semibold text-gray-900">{value}</p>
      </div>
    </div>
  );
}

export default function EventDetailPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;
  const { data: event, isLoading, isError, refetch } = usePublicEvent(slug);

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (isError || !event) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <Link
          href={ROUTE_POINT.events}
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-emerald-700 hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to events
        </Link>
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-sm text-red-600">Event not found or no longer available.</p>
            <Button type="button" variant="outline" size="sm" className="mt-4" onClick={() => refetch()}>
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const cover = event.coverImages?.[0];
  const spotsLeft = Math.max(event.maxParticipants - event.registeredCount, 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
      <div className="mx-auto max-w-5xl px-4 pb-12 pt-8 sm:px-6 lg:px-8">
        <Link
          href={ROUTE_POINT.events}
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-emerald-700 hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to events
        </Link>

        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="relative h-56 w-full bg-gray-100 sm:h-72 lg:h-96">
            {cover ? (
              <img src={cover} alt={event.title} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center bg-gradient-to-r from-green-100 to-blue-100 text-sm text-gray-500">
                No cover image
              </div>
            )}
            {isEventUpcoming(event.eventDate) ? (
              <div className="absolute left-4 top-4">
                <Badge variant="default">Upcoming</Badge>
              </div>
            ) : null}
          </div>

          <div className="space-y-6 p-6 sm:p-8">
            <div className="space-y-3">
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">{event.title}</h1>

              <div className="flex flex-col gap-2 text-sm text-gray-700 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays className="h-4 w-4 text-emerald-600" />
                  {formatEventDate(event.eventDate)}
                </span>
                {event.reportingTime ? (
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-emerald-600" />
                    Reporting at {event.reportingTime}
                  </span>
                ) : null}
                {event.location?.address ? (
                  <a
                    href={getGoogleMapsUrl(event.location)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-w-0 items-start gap-1.5 text-emerald-700 transition-colors hover:text-emerald-800"
                  >
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                    <span className="truncate underline-offset-2 hover:underline">
                      {event.location.address}
                    </span>
                  </a>
                ) : null}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              <EventDetailStat
                icon={IndianRupee}
                label="Entry fee"
                value={`${event.currency} ${event.price}`}
              />
              <EventDetailStat
                icon={UserRound}
                label="Participants"
                value={`${event.registeredCount}/${event.maxParticipants}`}
              />
              <EventDetailStat
                icon={UserRound}
                label="Spots left"
                value={String(spotsLeft)}
              />
            </div>

            {event.description ? (
              <div className="rounded-xl bg-muted/60 p-5">
                <h2 className="text-sm font-semibold text-gray-900">About this event</h2>
                <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                  {event.description}
                </p>
              </div>
            ) : null}

            <EventRegistrationSection event={event} />
          </div>
        </div>
      </div>
    </div>
  );
}
