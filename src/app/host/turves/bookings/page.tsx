"use client";

import { MyDrawer } from "@/components/my-drawer";
import { InfiniteScrollSentinel } from "@/components/infinite-scroll/infinite-scroll-sentinel";
import { ScrollableListPanel } from "@/components/infinite-scroll/scrollable-list-panel";
import BookingDetailPanel from "./_components/booking-detail-panel";
import OwnerBookingCard from "./_components/owner-booking-card";
import {
  ALL_FILTER,
  EMPTY_TURF_BOOKINGS_FILTERS,
  TurfBookingsFilters,
} from "./_components/turf-bookings-filters";
import { flattenPaginatedPages } from "@/lib/query/paginated-infinite";
import { useInfiniteOwnerBookings } from "@/modules/host/hooks/use-owner-bookings";
import type { TurfBookingStatus } from "@/modules/host/types/owner-booking";
import { Loader2 } from "lucide-react";
import { useState } from "react";

export default function HostBookingsPage() {
  const [selectedStatus, setSelectedStatus] = useState(
    EMPTY_TURF_BOOKINGS_FILTERS.selectedStatus,
  );
  const [selectedTurfId, setSelectedTurfId] = useState(
    EMPTY_TURF_BOOKINGS_FILTERS.selectedTurfId,
  );
  const [startDate, setStartDate] = useState(
    EMPTY_TURF_BOOKINGS_FILTERS.startDate,
  );
  const [endDate, setEndDate] = useState(EMPTY_TURF_BOOKINGS_FILTERS.endDate);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(
    null,
  );
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
  } = useInfiniteOwnerBookings({
    ...(selectedStatus !== ALL_FILTER
      ? { status: selectedStatus as TurfBookingStatus }
      : {}),
    ...(selectedTurfId ? { turf: selectedTurfId } : {}),
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
    setSelectedStatus(EMPTY_TURF_BOOKINGS_FILTERS.selectedStatus);
    setSelectedTurfId(EMPTY_TURF_BOOKINGS_FILTERS.selectedTurfId);
    setStartDate(EMPTY_TURF_BOOKINGS_FILTERS.startDate);
    setEndDate(EMPTY_TURF_BOOKINGS_FILTERS.endDate);
  };

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <div className="shrink-0 space-y-6">
        <h2 className="text-xl font-bold text-gray-900">Turf bookings</h2>

        <TurfBookingsFilters
          selectedStatus={selectedStatus}
          selectedTurfId={selectedTurfId}
          startDate={startDate}
          endDate={endDate}
          onStatusChange={setSelectedStatus}
          onTurfChange={setSelectedTurfId}
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
              <OwnerBookingCard
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
          <BookingDetailPanel id={selectedBookingId} />
        ) : null}
      </MyDrawer>
    </div>
  );
}
