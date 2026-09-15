"use client";

import ProtectedPage from "@/guards/ProtectedPage";
import { MyDrawer } from "@/components/my-drawer";
import { InfiniteScrollSentinel } from "@/components/infinite-scroll/infinite-scroll-sentinel";
import { ScrollableListPanel } from "@/components/infinite-scroll/scrollable-list-panel";
import MyEventBookingCard from "./_components/my-event-booking-card";
import MyEventBookingDetailPanel from "./_components/my-event-booking-detail-panel";
import { flattenPaginatedPages } from "@/lib/query/paginated-infinite";
import { useInfiniteMyEventBookings } from "@/modules/event-bookings/hooks/use-my-event-bookings";
import type {
  EventBooking,
  EventBookingStatus,
} from "@/modules/event-bookings/types/booking";
import { Loader2 } from "lucide-react";
import { useState } from "react";

const TABS: { label: string; status?: EventBookingStatus }[] = [
  { label: "All" },
  { label: "Pending", status: "pending" },
  { label: "Confirmed", status: "confirmed" },
  { label: "Cancelled", status: "cancelled" },
  { label: "Completed", status: "completed" },
];

function MyBookingsContent() {
  const [activeStatus, setActiveStatus] = useState<EventBookingStatus | undefined>();
  const [selectedBooking, setSelectedBooking] = useState<EventBooking | null>(null);
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
  } = useInfiniteMyEventBookings({
    status: activeStatus,
    sortOrder: "desc",
  });

  const bookings = flattenPaginatedPages(data?.pages);

  const openBooking = (booking: EventBooking) => {
    setSelectedBooking(booking);
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setSelectedBooking(null);
    setDrawerOpen(false);
  };

  return (
    <div className="mx-auto flex h-[calc(100dvh-4rem)] max-w-3xl flex-col overflow-hidden px-4 py-8 sm:px-6 lg:px-8">
      <div className="shrink-0 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My bookings</h1>
          <p className="mt-1 text-muted-foreground">
            Your event registrations and payment status.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {TABS.map((tab) => (
            <button
              key={tab.label}
              type="button"
              onClick={() => setActiveStatus(tab.status)}
              className={`rounded-full px-3 py-1 text-sm font-medium ring-1 ${
                activeStatus === tab.status
                  ? "bg-emerald-600 text-white ring-emerald-600"
                  : "bg-white text-gray-700 ring-gray-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
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
            You have no event bookings yet.
          </p>
        ) : (
          <div className="flex flex-col gap-4 pb-4">
            {bookings.map((booking) => (
              <MyEventBookingCard
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
        {selectedBooking ? (
          <MyEventBookingDetailPanel booking={selectedBooking} />
        ) : null}
      </MyDrawer>
    </div>
  );
}

export default function MyBookingsPage() {
  return (
    <ProtectedPage>
      <MyBookingsContent />
    </ProtectedPage>
  );
}
