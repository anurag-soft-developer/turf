"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { format } from "date-fns";
import { CalendarDays, IndianRupee, Loader2, MapPin } from "lucide-react";
import { ROUTE_POINT } from "@/lib/constants/route-point";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  EMPTY_PUBLIC_EVENTS_FILTERS,
  parsePublicEventsSort,
  PublicEventsFilters,
  todayDateInputValue,
  type PublicEventsSortValue,
} from "@/app/events/_components/public-events-filters";
import { FeaturedEventsCarousel } from "@/app/events/_components/featured-events-carousel";
import { usePublicEvents } from "@/modules/public-events/hooks/use-public-events";
import type { HostEvent } from "@/modules/host/types/event";

const PAGE_LIMIT = 24;

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
  const priceLabel =
    event.price > 0 ? `${event.currency} ${event.price}` : "Free entry";

  return (
    <Link
      href={ROUTE_POINT.eventDetail(event.slug)}
      className="group block"
    >
      <Card className="flex flex-col gap-0 overflow-hidden border-gray-200 py-0 transition-shadow hover:shadow-md">
        <div className="relative h-36 w-full shrink-0 bg-gray-100">
          {cover ? (
            <img
              src={cover}
              alt={event.title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-gray-500">
              No cover image
            </div>
          )}
        </div>

        <CardContent className="flex flex-col gap-2.5 p-4">
          <div className="min-w-0 space-y-1">
            <h3 className="line-clamp-1 text-base font-semibold text-gray-900 group-hover:text-emerald-800">
              {event.title}
            </h3>
            <p className="line-clamp-2 text-sm text-muted-foreground">
              {event.description}
            </p>
          </div>

          <div className="space-y-1.5 border-t border-gray-100 pt-2.5 text-sm text-gray-700">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
              <span className="truncate">{formatEventDate(event.eventDate)}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
              <span className="truncate">{eventLocation(event)}</span>
            </div>
            <div className="flex items-center gap-2">
              <IndianRupee className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
              <span className="truncate font-medium text-emerald-700">{priceLabel}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export default function EventsPage() {
  const [searchText, setSearchText] = useState(EMPTY_PUBLIC_EVENTS_FILTERS.searchText);
  const [city, setCity] = useState(EMPTY_PUBLIC_EVENTS_FILTERS.city);
  const [startDate, setStartDate] = useState(() => todayDateInputValue());
  const [endDate, setEndDate] = useState(EMPTY_PUBLIC_EVENTS_FILTERS.endDate);
  const [sort, setSort] = useState<PublicEventsSortValue>(EMPTY_PUBLIC_EVENTS_FILTERS.sort);

  const handleStartDateChange = (value: string) => {
    const today = todayDateInputValue();
    const nextStart = value < today ? today : value;
    setStartDate(nextStart);
    if (endDate && endDate < nextStart) {
      setEndDate("");
    }
  };

  const handleEndDateChange = (value: string) => {
    const today = todayDateInputValue();
    const minEnd = startDate >= today ? startDate : today;
    if (!value) {
      setEndDate("");
      return;
    }
    setEndDate(value < minEnd ? minEnd : value);
  };

  const queryParams = useMemo(() => {
    const parsedSort = sort ? parsePublicEventsSort(sort) : null;

    return {
      page: 1,
      limit: PAGE_LIMIT,
      ...(searchText.trim() ? { globalSearchText: searchText.trim() } : {}),
      ...(city.trim() ? { city: city.trim() } : {}),
      startDate,
      ...(endDate ? { endDate } : {}),
      sortBy: parsedSort?.sortBy,
      sortOrder: parsedSort?.sortOrder,
    };
  }, [searchText, city, startDate, endDate, sort]);

  const { data, isLoading, isError, refetch } = usePublicEvents(queryParams);
  const upcomingEvents = data?.data ?? [];

  const featuredEvents = useMemo(() => upcomingEvents.slice(0, 5), [upcomingEvents]);

  const clearFilters = () => {
    setSearchText(EMPTY_PUBLIC_EVENTS_FILTERS.searchText);
    setCity(EMPTY_PUBLIC_EVENTS_FILTERS.city);
    setStartDate(todayDateInputValue());
    setEndDate(EMPTY_PUBLIC_EVENTS_FILTERS.endDate);
    setSort(EMPTY_PUBLIC_EVENTS_FILTERS.sort);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
      <section className="mx-auto max-w-7xl px-4 pb-6 pt-8 sm:px-6 lg:px-8">
        <FeaturedEventsCarousel events={featuredEvents} />
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:gap-6">
          <aside className="w-full shrink-0 lg:sticky lg:top-4 lg:w-52 xl:w-56">
            <PublicEventsFilters
              searchText={searchText}
              city={city}
              startDate={startDate}
              endDate={endDate}
              sort={sort}
              onSearchChange={setSearchText}
              onCityChange={setCity}
              onStartDateChange={handleStartDateChange}
              onEndDateChange={handleEndDateChange}
              onSortChange={setSort}
              onClearAll={clearFilters}
            />
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
