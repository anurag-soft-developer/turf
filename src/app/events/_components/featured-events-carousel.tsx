"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { format } from "date-fns";
import Autoplay from "embla-carousel-autoplay";
import { CalendarDays, MapPin } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { ROUTE_POINT } from "@/lib/constants/route-point";
import type { HostEvent } from "@/modules/host/types/event";

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

function FeaturedSlide({ event }: { event: HostEvent }) {
  const cover = eventCover(event);

  return (
    <Link
      href={ROUTE_POINT.eventDetail(event.slug)}
      className="relative block h-[280px] w-full sm:h-[340px] lg:h-[420px]"
    >
      {cover ? (
        <img src={cover} alt={event.title} className="h-full w-full object-cover" />
      ) : (
        <div className="h-full w-full bg-gradient-to-r from-green-100 to-blue-100" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
      <div className="absolute bottom-0 w-full p-4 sm:p-6 lg:p-8">
        <h1 className="line-clamp-2 text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
          {event.title}
        </h1>
        <div className="mt-3 flex flex-col gap-2 text-sm text-gray-100 sm:flex-row sm:items-center sm:gap-4">
          <span className="inline-flex shrink-0 items-center gap-1.5">
            <CalendarDays className="h-4 w-4" />
            {formatEventDate(event.eventDate)}
          </span>
          <span className="inline-flex min-w-0 items-center gap-1.5">
            <MapPin className="h-4 w-4 shrink-0" />
            <span className="truncate">{eventLocation(event)}</span>
          </span>
        </div>
      </div>
    </Link>
  );
}

function EmptyHero() {
  return (
    <div className="flex h-[280px] items-center justify-center bg-gradient-to-r from-green-50 to-blue-50 sm:h-[340px]">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
          Discover upcoming events
        </h1>
        <p className="mt-2 text-sm text-gray-600">No featured events available yet.</p>
      </div>
    </div>
  );
}

function CarouselDots({
  count,
  current,
  onSelect,
}: {
  count: number;
  current: number;
  onSelect: (index: number) => void;
}) {
  return (
    <div className="flex items-center justify-center gap-2 border-t border-gray-100 bg-white py-3">
      {Array.from({ length: count }).map((_, index) => (
        <button
          key={index}
          type="button"
          aria-label={`Go to slide ${index + 1}`}
          onClick={() => onSelect(index)}
          className={`h-2.5 rounded-full transition-all ${
            index === current ? "w-6 bg-emerald-600" : "w-2.5 bg-gray-300"
          }`}
        />
      ))}
    </div>
  );
}

export function FeaturedEventsCarousel({ events }: { events: HostEvent[] }) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const autoplayPlugin = useRef(Autoplay({ delay: 4500, stopOnInteraction: true }));

  const onSelect = useCallback((carouselApi: CarouselApi) => {
    if (!carouselApi) return;
    setCurrent(carouselApi.selectedScrollSnap());
  }, []);

  useEffect(() => {
    if (!api) return undefined;

    onSelect(api);
    api.on("select", onSelect);
    api.on("reInit", onSelect);

    return () => {
      api.off("select", onSelect);
      api.off("reInit", onSelect);
    };
  }, [api, onSelect]);

  if (events.length === 0) {
    return (
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <EmptyHero />
      </div>
    );
  }

  if (events.length === 1) {
    return (
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <FeaturedSlide event={events[0]} />
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <Carousel
        setApi={setApi}
        opts={{ loop: true, align: "start" }}
        plugins={[autoplayPlugin.current]}
        className="w-full"
      >
        <CarouselContent className="-ml-0">
          {events.map((event) => (
            <CarouselItem key={event._id} className="basis-full pl-0">
              <FeaturedSlide event={event} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      <CarouselDots
        count={events.length}
        current={current}
        onSelect={(index) => api?.scrollTo(index)}
      />
    </div>
  );
}
