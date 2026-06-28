"use client";

import { MyDrawer } from "@/components/my-drawer";
import { InfiniteScrollSentinel } from "@/components/infinite-scroll/infinite-scroll-sentinel";
import { ScrollableListPanel } from "@/components/infinite-scroll/scrollable-list-panel";
import EventBookingDetailPanel from "./_components/event-booking-detail-panel";
import {
  ALL_FILTER,
  EMPTY_EVENT_BOOKINGS_FILTERS,
  EventBookingsFilters,
} from "./_components/event-bookings-filters";
import OwnerEventBookingCard from "./_components/owner-event-booking-card";
import { flattenPaginatedPages } from "@/lib/query/paginated-infinite";
import { useInfiniteOwnerEventBookings } from "@/modules/host/hooks/use-owner-event-bookings";
import type { EventBookingStatus } from "@/modules/host/types/owner-event-booking";
import { Loader2 } from "lucide-react";
import { useState } from "react";

export default function HostEventBookingsPage() {
  const [selectedStatus, setSelectedStatus] = useState(
    EMPTY_EVENT_BOOKINGS_FILTERS.selectedStatus,
  );
  const [selectedEventId, setSelectedEventId] = useState(
    EMPTY_EVENT_BOOKINGS_FILTERS.selectedEventId,
  );
  const [startDate, setStartDate] = useState(
    EMPTY_EVENT_BOOKINGS_FILTERS.startDate,
  );
  const [endDate, setEndDate] = useState(EMPTY_EVENT_BOOKINGS_FILTERS.endDate);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const {
    data,
    isLoading,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetchNextPageError,
  } = useInfiniteOwnerEventBookings({
    ...(selectedStatus !== ALL_FILTER
      ? { status: selectedStatus as EventBookingStatus }
      : {}),
    ...(selectedEventId ? { event: selectedEventId } : {}),
    ...(startDate ? { startDate } : {}),
    ...(endDate ? { endDate } : {}),
    sortOrder: "desc",
  });

  const bookings = flattenPaginatedPages(data?.pages);

  const openBooking = (id: string) => {
    setSelectedBookingId(id);
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setSelectedBookingId(null);
    setDrawerOpen(false);
  };

  const clearFilters = () => {
    setSelectedStatus(EMPTY_EVENT_BOOKINGS_FILTERS.selectedStatus);
    setSelectedEventId(EMPTY_EVENT_BOOKINGS_FILTERS.selectedEventId);
    setStartDate(EMPTY_EVENT_BOOKINGS_FILTERS.startDate);
    setEndDate(EMPTY_EVENT_BOOKINGS_FILTERS.endDate);
  };

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <div className="shrink-0 space-y-6">
        <h2 className="text-xl font-bold text-gray-900">Event bookings</h2>

        <EventBookingsFilters
          selectedStatus={selectedStatus}
          selectedEventId={selectedEventId}
          startDate={startDate}
          endDate={endDate}
          onStatusChange={setSelectedStatus}
          onEventChange={setSelectedEventId}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
          onClear={clearFilters}
        />
      </div>

      <ScrollableListPanel className="mt-6 min-h-0 flex-1">
        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
          </div>
        ) : isError ? (
          <p className="text-center text-muted-foreground">
            Failed to load bookings.{" "}
            <button
              type="button"
              className="text-emerald-600 underline"
              onClick={() => refetch()}
            >
              Retry
            </button>
          </p>
        ) : bookings.length === 0 ? (
          <p className="py-12 text-center text-muted-foreground">
            No bookings match your filters.
          </p>
        ) : (
          <div className="flex flex-col gap-4 pb-4">
            {bookings.map((booking) => (
              <OwnerEventBookingCard
                key={booking._id}
                booking={booking}
                onSelect={openBooking}
              />
            ))}
            <InfiniteScrollSentinel
              hasNextPage={hasNextPage}
              isFetchingNextPage={isFetchingNextPage}
              fetchNextPage={() => fetchNextPage()}
              isError={isFetchNextPageError}
              onRetry={() => fetchNextPage()}
            />
          </div>
        )}
      </ScrollableListPanel>

      <MyDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        title="Booking details"
        onClose={handleDrawerClose}
      >
        {selectedBookingId ? (
          <EventBookingDetailPanel id={selectedBookingId} />
        ) : null}
      </MyDrawer>
    </div>
  );
}
