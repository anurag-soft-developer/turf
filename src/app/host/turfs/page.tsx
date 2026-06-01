"use client";

import { MyDrawer } from "@/components/my-drawer";
import EditTurfPanel from "./_components/edit-turf-panel";
import NewTurfPanel from "./_components/new-turf-panel";
import TurfDetailPanel from "./_components/turf-detail-panel";
import { Card, CardContent } from "@/components/ui/card";
import { useMyTurfs } from "@/modules/host/hooks/use-my-turfs";
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
      router.replace("/host/turfs");
    }
  }, [searchParams, onOpenNew, router]);

  return null;
}

function HostTurfsPageContent() {
  const [view, setView] = useState<TurfDrawerView | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

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

  const { data, isLoading, isError, refetch, isFetching } = useMyTurfs({
    limit: 50,
  });

  const turfs = data?.data ?? [];

  const handleDrawerClose = () => {
    closeDrawer();
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
    <div className="space-y-6">
      <Suspense fallback={null}>
        <TurfDrawerQuerySync onOpenNew={openDrawerNew} />
      </Suspense>

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
      ) : (
        <div className="flex flex-col gap-4">
          {isFetching && !isLoading ? (
            <p className="text-sm text-muted-foreground">Refreshing…</p>
          ) : null}
          {turfs.map((turf) => (
            <button
              key={turf._id}
              type="button"
              onClick={() => openDrawerDetail(turf._id)}
              className="block w-full text-left"
            >
              <Card className="transition-shadow hover:shadow-md">
                <CardContent className="flex items-center gap-4 pt-4">
                  {turf.images?.[0] ? (
                    <img
                      src={turf.images[0]}
                      alt=""
                      className="h-16 w-16 shrink-0 rounded-lg object-cover ring-1 ring-gray-200"
                    />
                  ) : (
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-gray-100 ring-1 ring-gray-200">
                      <MapPin className="h-6 w-6 text-gray-400" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-gray-900">{turf?.name}</p>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {turf?.location?.address}
                    </p>
                    <p className="mt-1 text-sm text-emerald-700">
                      ₹{turf?.pricing?.basePricePerHour}/hr
                      {turf?.isAvailable === false ? " · Unavailable" : ""}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </button>
          ))}
        </div>
      )}

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
