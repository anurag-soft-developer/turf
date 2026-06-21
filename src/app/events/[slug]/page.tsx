"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { format } from "date-fns";
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
import { usePublicEvent } from "@/modules/public-events/hooks/use-public-event";
import EventRegistrationSection from "./_components/event-registration-section";

function formatEventDate(value?: string) {
  if (!value) return "Date not set";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date not set";
  return format(date, "EEEE, MMMM d, yyyy");
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
            <div className="absolute left-4 top-4">
              <Badge variant="default">Upcoming</Badge>
            </div>
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
                  <span className="inline-flex items-start gap-1.5">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                    {event.location.address}
                  </span>
                ) : null}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-xl border bg-card p-4">
                <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                  <IndianRupee className="h-4 w-4" />
                </div>
                <p className="text-xs font-medium text-muted-foreground">Entry fee</p>
                <p className="mt-0.5 text-lg font-semibold text-gray-900">
                  {event.currency} {event.price}
                </p>
              </div>

              <div className="rounded-xl border bg-card p-4">
                <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                  <UserRound className="h-4 w-4" />
                </div>
                <p className="text-xs font-medium text-muted-foreground">Participants</p>
                <p className="mt-0.5 text-lg font-semibold text-gray-900">
                  {event.registeredCount}/{event.maxParticipants}
                </p>
              </div>

              <div className="rounded-xl border bg-card p-4">
                <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                  <UserRound className="h-4 w-4" />
                </div>
                <p className="text-xs font-medium text-muted-foreground">Spots left</p>
                <p className="mt-0.5 text-lg font-semibold text-gray-900">{spotsLeft}</p>
              </div>
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
