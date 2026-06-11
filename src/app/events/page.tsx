"use client";

import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { CalendarDays, Loader2, MapPin, SlidersHorizontal } from "lucide-react";
import { PlacesAutocomplete } from "@/components/places-autocomplete";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { usePublicEvents } from "@/modules/public-events/hooks/use-public-events";
import type { HostEvent } from "@/modules/host/types/event";

type SortValue =
  | ""
  | "eventDate:asc"
  | "eventDate:desc"
  | "price:asc"
  | "price:desc";

const PAGE_LIMIT = 24;
const SORT_OPTIONS: Array<{ value: SortValue; label: string }> = [
  { value: "", label: "Recommended" },
  { value: "eventDate:asc", label: "Soonest first" },
  { value: "eventDate:desc", label: "Latest first" },
  { value: "price:asc", label: "Price: low to high" },
  { value: "price:desc", label: "Price: high to low" },
];

function parseSort(sort: Exclude<SortValue, "">): {
  sortBy: string;
  sortOrder: "asc" | "desc";
} {
  const [sortBy, sortOrder] = sort.split(":") as [string, "asc" | "desc"];
  return { sortBy, sortOrder };
}

function formatEventDate(value?: string) {
  if (!value) return "Date not set";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date not set";
  return format(date, "EEE, MMM d, yyyy");
}

function eventLocation(event: HostEvent) {
  return event.location?.address || "Location not specified";
}

function eventCover(event: HostEvent) {
  return event.coverImages?.[0] || "";
}

function EventCard({ event }: { event: HostEvent }) {
  const cover = eventCover(event);

  return (
    <Card className="overflow-hidden border-gray-200 transition-shadow hover:shadow-md">
      <CardContent className="p-0">
        <div className="relative h-44 w-full bg-gray-100">
          {cover ? (
            <img src={cover} alt={event.title} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-gray-500">
              No cover image
            </div>
          )}
          <div className="absolute left-3 top-3">
            <Badge variant="default">Upcoming</Badge>
          </div>
        </div>

        <div className="space-y-2 p-4">
          <h3 className="line-clamp-1 text-lg font-semibold text-gray-900">{event.title}</h3>
          <p className="line-clamp-2 text-sm text-gray-600">{event.description}</p>

          <div className="flex items-center gap-2 text-sm text-gray-700">
            <CalendarDays className="h-4 w-4 text-green-600" />
            <span>{formatEventDate(event.eventDate)}</span>
          </div>

          <div className="flex items-start gap-2 text-sm text-gray-700">
            <MapPin className="mt-0.5 h-4 w-4 text-green-600" />
            <span className="line-clamp-1">{eventLocation(event)}</span>
          </div>

          <p className="pt-1 text-sm font-semibold text-emerald-700">
            {event.currency} {event.price}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export default function EventsPage() {
  const [locationLabel, setLocationLabel] = useState("");
  const [locationCoords, setLocationCoords] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [sort, setSort] = useState<SortValue>("");

  const [activeSlide, setActiveSlide] = useState(0);

  const queryParams = useMemo(() => {
    const parsedSort = sort ? parseSort(sort) : null;

    return {
      page: 1,
      limit: PAGE_LIMIT,
      location: locationCoords
        ? {
            nearbyLat: locationCoords.lat,
            nearbyLng: locationCoords.lng,
          }
        : undefined,
      sortBy: parsedSort?.sortBy,
      sortOrder: parsedSort?.sortOrder,
    };
  }, [locationCoords, sort]);

  const { data, isLoading, isError, refetch } = usePublicEvents(queryParams);
  const upcomingEvents = data?.data ?? [];

  const featuredEvents = useMemo(() => upcomingEvents.slice(0, 5), [upcomingEvents]);

  useEffect(() => {
    setActiveSlide(0);
  }, [featuredEvents.length]);

  useEffect(() => {
    if (featuredEvents.length <= 1) return undefined;
    const timer = window.setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % featuredEvents.length);
    }, 4500);
    return () => window.clearInterval(timer);
  }, [featuredEvents.length]);

  const activeFeatured = featuredEvents[activeSlide];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
      <section className="mx-auto max-w-7xl px-4 pb-6 pt-8 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          {activeFeatured ? (
            <div className="relative h-[280px] w-full sm:h-[340px] lg:h-[420px]">
              {eventCover(activeFeatured) ? (
                <img
                  src={eventCover(activeFeatured)}
                  alt={activeFeatured.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full bg-gradient-to-r from-green-100 to-blue-100" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
              <div className="absolute bottom-0 w-full p-4 sm:p-6 lg:p-8">
                <p className="mb-2 inline-flex rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white backdrop-blur">
                  Events carousel
                </p>
                <h1 className="text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
                  {activeFeatured.title}
                </h1>
                <div className="mt-3 flex flex-col gap-2 text-sm text-gray-100 sm:flex-row sm:items-center sm:gap-4">
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarDays className="h-4 w-4" />
                    {formatEventDate(activeFeatured.eventDate)}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="h-4 w-4" />
                    {eventLocation(activeFeatured)}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex h-[280px] items-center justify-center bg-gradient-to-r from-green-50 to-blue-50 sm:h-[340px]">
              <div className="text-center">
                <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
                  Events carousel
                </p>
                <h1 className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl">
                  Discover upcoming events
                </h1>
                <p className="mt-2 text-sm text-gray-600">No featured events available yet.</p>
              </div>
            </div>
          )}

          {featuredEvents.length > 1 ? (
            <div className="flex items-center justify-center gap-2 border-t border-gray-100 bg-white py-3">
              {featuredEvents.map((event, index) => (
                <button
                  key={event._id}
                  type="button"
                  aria-label={`Go to slide ${index + 1}`}
                  onClick={() => setActiveSlide(index)}
                  className={`h-2.5 rounded-full transition-all ${
                    index === activeSlide ? "w-6 bg-emerald-600" : "w-2.5 bg-gray-300"
                  }`}
                />
              ))}
            </div>
          ) : null}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:gap-6">
          <aside className="w-full shrink-0 lg:sticky lg:top-4 lg:w-52 xl:w-56">
            <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
              <div className="mb-3 flex items-center gap-1.5 border-b border-gray-100 pb-2">
                <SlidersHorizontal className="h-3.5 w-3.5 text-emerald-600" />
                <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-700">
                  Filters
                </h2>
              </div>

              <div className="space-y-3">
                <div className="space-y-1">
                  <label htmlFor="event-location" className="text-xs font-medium text-gray-600">
                    Location
                  </label>
                  <PlacesAutocomplete
                    id="event-location"
                    cityOnly
                    value={locationLabel}
                    onAddressChange={(value) => {
                      setLocationLabel(value);
                      setLocationCoords(null);
                    }}
                    onPlaceSelect={(place) => {
                      setLocationLabel(place.address);
                      setLocationCoords({
                        lat: place.latitude,
                        lng: place.longitude,
                      });
                    }}
                    placeholder="Search city"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="event-sort" className="text-xs font-medium text-gray-600">
                    Sort by
                  </label>
                  <select
                    id="event-sort"
                    value={sort}
                    onChange={(e) => setSort(e.target.value as SortValue)}
                    className="flex h-8 w-full rounded-md border border-input bg-transparent px-2 text-xs outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50"
                  >
                    {SORT_OPTIONS.map((option) => (
                      <option key={option.value || "recommended"} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {locationCoords || sort ? (
                  <button
                    type="button"
                    onClick={() => {
                      setLocationLabel("");
                      setLocationCoords(null);
                      setSort("");
                    }}
                    className="w-full rounded-md border border-gray-200 px-2 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50"
                  >
                    Clear filters
                  </button>
                ) : null}
              </div>
            </div>
          </aside>

          <div className="min-w-0 flex-1">
            {isLoading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
              </div>
            ) : isError ? (
              <Card>
                <CardContent className="py-8 text-center">
                  <p className="text-sm text-red-600">
                    Failed to load public events. Please try again.
                  </p>
                  <button
                    type="button"
                    onClick={() => refetch()}
                    className="mt-2 text-sm font-medium text-emerald-700 underline"
                  >
                    Retry
                  </button>
                </CardContent>
              </Card>
            ) : (
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-lg font-bold text-gray-900">Upcoming events</h2>
                  <Badge variant="outline" className="text-xs">
                    {upcomingEvents.length}
                  </Badge>
                </div>
                {upcomingEvents.length === 0 ? (
                  <Card>
                    <CardContent className="py-8 text-center text-sm text-gray-600">
                      No upcoming events found for the selected filters.
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {upcomingEvents.map((event) => (
                      <EventCard key={event._id} event={event} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
