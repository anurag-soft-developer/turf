"use client";

import { MyDrawer } from "@/components/my-drawer";
import EditTurfPanel from "./_components/edit-turf-panel";
import NewTurfPanel from "./_components/new-turf-panel";
import TurfDetailPanel from "./_components/turf-detail-panel";
import TurfListCard from "./_components/turf-list-card";
import {
  ALL_FILTER,
  EMPTY_TURVES_FILTERS,
  TurvesFilters,
} from "./_components/turves-filters";
import { Card, CardContent } from "@/components/ui/card";
import { InfiniteScrollSentinel } from "@/components/infinite-scroll/infinite-scroll-sentinel";
import { ScrollableListPanel } from "@/components/infinite-scroll/scrollable-list-panel";
import { ROUTE_POINT } from "@/lib/constants/route-point";
import { flattenPaginatedPages } from "@/lib/query/paginated-infinite";
import { useInfiniteMyTurfs } from "@/modules/host/hooks/use-my-turfs";
import type { TurfStatus } from "@/types/turf";
import { Loader2, MapPin, Plus } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useState } from "react";

type TurfDrawerView =
  | { kind: "new" }
  | { kind: "detail"; id: string }
  | { kind: "edit"; id: string };

function turfDrawerTitle(view: TurfDrawerView | null) {
  if (!view) return "Turf details";
  if (view.kind === "new") return "Add new turf";
  if (view.kind === "edit") return "Edit turf";
  return "Turf details";
}

function TurfDrawerQuerySync({ onOpenNew }: { onOpenNew: () => void }) {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (searchParams.get("drawer") === "new") {
      onOpenNew();
      router.replace(ROUTE_POINT.host.turves.list, { scroll: false });
    }
  }, [searchParams, onOpenNew, router]);

  return null;
}

function HostTurfsPageContent() {
  const [view, setView] = useState<TurfDrawerView | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(
    EMPTY_TURVES_FILTERS.selectedStatus,
  );
  const [searchText, setSearchText] = useState(EMPTY_TURVES_FILTERS.searchText);
  const [availability, setAvailability] = useState(
    EMPTY_TURVES_FILTERS.availability,
  );

  const hasActiveFilters =
    selectedStatus !== ALL_FILTER ||
    Boolean(searchText.trim()) ||
    availability !== ALL_FILTER;

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
  } = useInfiniteMyTurfs({
    ...(selectedStatus !== ALL_FILTER
      ? { status: selectedStatus as TurfStatus }
      : {}),
    ...(searchText.trim() ? { globalSearchText: searchText.trim() } : {}),
    ...(availability === "true"
      ? { isAvailable: true }
      : availability === "false"
        ? { isAvailable: false }
        : {}),
  });

  const turfs = flattenPaginatedPages(data?.pages);

  const handleDrawerClose = () => {
    closeDrawer();
  };

  const clearFilters = () => {
    setSelectedStatus(EMPTY_TURVES_FILTERS.selectedStatus);
    setSearchText(EMPTY_TURVES_FILTERS.searchText);
    setAvailability(EMPTY_TURVES_FILTERS.availability);
  };

  let drawerContent: React.ReactNode = null;
  if (view?.kind === "new") {
    drawerContent = (
      <NewTurfPanel
        onSuccess={() => setDrawerOpen(false)}
        onCancel={() => setDrawerOpen(false)}
      />
    );
  } else if (view?.kind === "edit") {
    drawerContent = (
      <EditTurfPanel
        id={view.id}
        onSuccess={() => openDrawerDetail(view.id)}
        onCancel={() => openDrawerDetail(view.id)}
      />
    );
  } else if (view?.kind === "detail") {
    drawerContent = (
      <TurfDetailPanel
        id={view.id}
        onEdit={() => openDrawerEdit(view.id)}
        onDeleteSuccess={() => setDrawerOpen(false)}
      />
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <Suspense fallback={null}>
        <TurfDrawerQuerySync onOpenNew={openDrawerNew} />
      </Suspense>

      <div className="shrink-0 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-gray-900">My Turfs</h2>
          <button
            type="button"
            onClick={openDrawerNew}
            className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-primary px-2.5 text-sm font-medium text-primary-foreground"
          >
            <Plus className="h-4 w-4" />
            Add turf
          </button>
        </div>

        <TurvesFilters
          selectedStatus={selectedStatus}
          searchText={searchText}
          availability={availability}
          onStatusChange={setSelectedStatus}
          onSearchChange={setSearchText}
          onAvailabilityChange={setAvailability}
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
              Failed to load turfs.{" "}
              <button
                type="button"
                className="text-emerald-600 underline"
                onClick={() => refetch()}
              >
                Retry
              </button>
            </CardContent>
          </Card>
        ) : turfs.length === 0 ? (
          hasActiveFilters ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                No turfs match your filters.
              </CardContent>
            </Card>
          ) : (
          <Card>
            <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
              <MapPin className="h-12 w-12 text-gray-300" />
              <div>
                <p className="font-semibold text-gray-900">No turfs yet</p>
                <p className="text-sm text-muted-foreground">
                  Start by adding your first turf listing.
                </p>
              </div>
              <button
                type="button"
                onClick={openDrawerNew}
                className="inline-flex h-8 items-center rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground"
              >
                Add your first turf
              </button>
            </CardContent>
          </Card>
          )
        ) : (
          <div className="flex flex-col gap-4 pb-4">
            {isFetching && !isLoading && !isFetchingNextPage ? (
              <p className="text-sm text-muted-foreground">Refreshing…</p>
            ) : null}
            {turfs.map((turf) => (
              <TurfListCard
                key={turf._id}
                turf={turf}
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
        title={turfDrawerTitle(view)}
        onClose={handleDrawerClose}
      >
        {drawerContent}
      </MyDrawer>
    </div>
  );
}

export default function HostTurfsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
        </div>
      }
    >
      <HostTurfsPageContent />
    </Suspense>
  );
}
