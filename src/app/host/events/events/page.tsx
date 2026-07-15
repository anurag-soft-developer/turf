"use client";

import { MyDrawer } from "@/components/my-drawer";
import EditEventPanel from "./_components/edit-event-panel";
import NewEventPanel from "./_components/new-event-panel";
import EventDetailPanel from "./_components/event-detail-panel";
import EventListCard from "./_components/event-list-card";
import {
  ALL_FILTER,
  EMPTY_EVENTS_FILTERS,
  EventsFilters,
} from "./_components/events-filters";
import { Card, CardContent } from "@/components/ui/card";
import { InfiniteScrollSentinel } from "@/components/infinite-scroll/infinite-scroll-sentinel";
import { ScrollableListPanel } from "@/components/infinite-scroll/scrollable-list-panel";
import { ROUTE_POINT } from "@/lib/constants/route-point";
import { flattenPaginatedPages } from "@/lib/query/paginated-infinite";
import { useInfiniteMyEvents } from "@/modules/host/hooks/use-my-events";
import type { EventStatus } from "@/modules/host/types/event";
import { CalendarDays, Loader2, Plus } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useState } from "react";

type EventDrawerView =
  | { kind: "new" }
  | { kind: "detail"; id: string }
  | { kind: "edit"; id: string };

function eventDrawerTitle(view: EventDrawerView | null) {
  if (!view) return "Event details";
  if (view.kind === "new") return "Add new event";
  if (view.kind === "edit") return "Edit event";
  return "Event details";
}

function EventDrawerQuerySync({ onOpenNew }: { onOpenNew: () => void }) {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (searchParams.get("drawer") === "new") {
      onOpenNew();
      router.replace(ROUTE_POINT.host.events.events, { scroll: false });
    }
  }, [searchParams, onOpenNew, router]);

  return null;
}

function HostEventsPageContent() {
  const [view, setView] = useState<EventDrawerView | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(
    EMPTY_EVENTS_FILTERS.selectedStatus,
  );
  const [searchText, setSearchText] = useState(EMPTY_EVENTS_FILTERS.searchText);
  const [registrations, setRegistrations] = useState(
    EMPTY_EVENTS_FILTERS.registrations,
  );
  const [startDate, setStartDate] = useState(EMPTY_EVENTS_FILTERS.startDate);
  const [endDate, setEndDate] = useState(EMPTY_EVENTS_FILTERS.endDate);

  const hasActiveFilters =
    selectedStatus !== ALL_FILTER ||
    Boolean(searchText.trim()) ||
    registrations !== ALL_FILTER ||
    Boolean(startDate) ||
    Boolean(endDate);

  const openDrawerNew = useCallback(() => {
    setView({ kind: "new" });
    setDrawerOpen(true);
  }, []);

  const openDrawerDetail = useCallback((id: string) => {
    setView({ kind: "detail", id });
    setDrawerOpen(true);
  }, []);

  const openDrawerEdit = useCallback((id: string) => {
    setView({ kind: "edit", id });
    setDrawerOpen(true);
  }, []);

  const closeDrawer = useCallback(() => {
    setView(null);
    setDrawerOpen(false);
  }, []);

  const clearFilters = () => {
    setSelectedStatus(EMPTY_EVENTS_FILTERS.selectedStatus);
    setSearchText(EMPTY_EVENTS_FILTERS.searchText);
    setRegistrations(EMPTY_EVENTS_FILTERS.registrations);
    setStartDate(EMPTY_EVENTS_FILTERS.startDate);
    setEndDate(EMPTY_EVENTS_FILTERS.endDate);
  };

  const {
    data,
    isLoading,
    isError,
    refetch,
    isFetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetchNextPageError,
  } = useInfiniteMyEvents({
    ...(selectedStatus !== ALL_FILTER
      ? { status: selectedStatus as EventStatus }
      : {}),
    ...(searchText.trim() ? { globalSearchText: searchText.trim() } : {}),
    ...(registrations === "true"
      ? { registrationsPaused: true }
      : registrations === "false"
        ? { registrationsPaused: false }
        : {}),
    ...(startDate ? { startDate } : {}),
    ...(endDate ? { endDate } : {}),
    sortOrder: "desc",
  });

  const events = flattenPaginatedPages(data?.pages);

  let drawerContent: React.ReactNode = null;
  if (view?.kind === "new") {
    drawerContent = (
      <NewEventPanel
        onSuccess={() => setDrawerOpen(false)}
        onCancel={() => setDrawerOpen(false)}
      />
    );
  } else if (view?.kind === "edit") {
    drawerContent = (
      <EditEventPanel
        id={view.id}
        onSuccess={() => openDrawerDetail(view.id)}
        onCancel={() => openDrawerDetail(view.id)}
      />
    );
  } else if (view?.kind === "detail") {
    drawerContent = (
      <EventDetailPanel
        id={view.id}
        onEdit={() => openDrawerEdit(view.id)}
        onDeleteSuccess={() => setDrawerOpen(false)}
      />
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <Suspense fallback={null}>
        <EventDrawerQuerySync onOpenNew={openDrawerNew} />
      </Suspense>

      <div className="shrink-0 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-gray-900">My Events</h2>
          <button
            type="button"
            onClick={openDrawerNew}
            className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-primary px-2.5 text-sm font-medium text-primary-foreground"
          >
            <Plus className="h-4 w-4" />
            Add event
          </button>
        </div>

        <EventsFilters
          selectedStatus={selectedStatus}
          searchText={searchText}
          registrations={registrations}
          startDate={startDate}
          endDate={endDate}
          onStatusChange={setSelectedStatus}
          onSearchChange={setSearchText}
          onRegistrationsChange={setRegistrations}
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
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              Failed to load events. {" "}
              <button
                type="button"
                className="text-emerald-600 underline"
                onClick={() => refetch()}
              >
                Retry
              </button>
            </CardContent>
          </Card>
        ) : events.length === 0 ? (
          hasActiveFilters ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                No events match your filters.
              </CardContent>
            </Card>
          ) : (
          <Card>
            <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
              <CalendarDays className="h-12 w-12 text-gray-300" />
              <div>
                <p className="font-semibold text-gray-900">No events yet</p>
                <p className="text-sm text-muted-foreground">
                  Start by creating your first event.
                </p>
              </div>
              <button
                type="button"
                onClick={openDrawerNew}
                className="inline-flex h-8 items-center rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground"
              >
                Add your first event
              </button>
            </CardContent>
          </Card>
          )
        ) : (
          <div className="flex flex-col gap-4 pb-4">
            {isFetching && !isLoading && !isFetchingNextPage ? (
              <p className="text-sm text-muted-foreground">Refreshing...</p>
            ) : null}

            {events.map((event) => (
              <EventListCard
                key={event._id}
                event={event}
                onOpen={openDrawerDetail}
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
        title={eventDrawerTitle(view)}
        onClose={closeDrawer}
      >
        {drawerContent}
      </MyDrawer>
    </div>
  );
}

export default function HostEventsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
        </div>
      }
    >
      <HostEventsPageContent />
    </Suspense>
  );
}
