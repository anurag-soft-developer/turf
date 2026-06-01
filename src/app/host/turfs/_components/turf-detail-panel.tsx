"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { useHostTurf } from "@/modules/host/hooks/use-my-turfs";
import { useDeleteTurf } from "@/modules/host/hooks/use-turf-mutations";
import { cn } from "@/lib/utils";
import {
  Clock,
  IndianRupee,
  Loader2,
  MapPin,
  Pencil,
  Ruler,
  Star,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import type { GeoLocation } from "@/types/common";

function getGoogleMapsUrl(location: GeoLocation): string {
  const [lng, lat] = location.coordinates?.coordinates ?? [];
  if (lat != null && lng != null && !(lat === 0 && lng === 0)) {
    return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
  }
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location.address)}`;
}

interface TurfDetailPanelProps {
  id: string;
  onEdit?: () => void;
  onDeleteSuccess?: () => void;
}

function TurfDetailStat({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border bg-card p-3.5">
      <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
        <Icon className="h-4 w-4" />
      </div>
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-sm font-semibold text-gray-900">{value}</p>
    </div>
  );
}

function TurfDetailActions({
  onDelete,
  onEdit,
}: {
  onDelete: () => void;
  onEdit?: () => void;
}) {
  return (
    <div className="flex gap-2 justify-end">
      <Button
        type="button"
        variant="default"
        size="sm"
        onClick={onEdit}
        className="gap-1.5 bg-emerald-600 hover:bg-emerald-700"
      >
        <Pencil className="h-4 w-4" />
        Edit turf
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={onDelete}
        className="gap-1.5 text-destructive hover:bg-destructive/5 hover:text-destructive"
      >
        <Trash2 className="h-4 w-4" />
        Delete
      </Button>
    </div>
  );
}

export default function TurfDetailPanel({
  id,
  onEdit,
  onDeleteSuccess,
}: TurfDetailPanelProps) {
  const { data: turf, isLoading, isError } = useHostTurf(id);
  const deleteMutation = useDeleteTurf();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (isError || !turf) {
    return (
      <div className="flex flex-col items-center gap-2 py-16 text-center">
        <MapPin className="h-10 w-10 text-gray-300" />
        <p className="text-muted-foreground">Turf not found.</p>
      </div>
    );
  }

  const images = turf.images ?? [];
  const hasImages = images.length > 0;
  const heroImage = hasImages ? images[activeImage] : null;

  const dimensionsLabel =
    turf.dimensions?.length && turf.dimensions?.width
      ? `${turf.dimensions.length} × ${turf.dimensions.width} ${turf.dimensions.unit ?? "m"}`
      : null;

  return (
    <div className="-mx-4 flex min-h-full flex-col">
      <div className="space-y-5 px-4 py-4 pb-2">
        {/* Hero image */}
        <div className="-mx-4 overflow-hidden">
          {heroImage ? (
            <div className="relative aspect-[16/9] w-full bg-gray-100">
              <img
                src={heroImage}
                alt={turf.name}
                className="h-full w-full object-cover"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge
                    variant={
                      turf.isAvailable === false ? "secondary" : "default"
                    }
                    className={cn(
                      turf.isAvailable !== false &&
                        "border-emerald-200 bg-emerald-600 text-white hover:bg-emerald-600",
                    )}
                  >
                    {turf.isAvailable === false ? "Unavailable" : "Available"}
                  </Badge>
                  {turf.sportType?.map((sport) => (
                    <Badge
                      key={sport}
                      variant="outline"
                      className="border-white/30 bg-black/20 text-white backdrop-blur-sm"
                    >
                      {sport}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex aspect-[16/9] w-full items-center justify-center bg-gradient-to-br from-emerald-50 to-emerald-100">
              <MapPin className="h-14 w-14 text-emerald-300" />
            </div>
          )}
        </div>

        {/* Thumbnail strip */}
        {images.length > 1 ? (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {images.map((url, index) => (
              <button
                key={url}
                type="button"
                onClick={() => setActiveImage(index)}
                className={cn(
                  "h-16 w-16 shrink-0 overflow-hidden rounded-lg ring-2 ring-offset-2 transition-all",
                  activeImage === index
                    ? "ring-emerald-600"
                    : "ring-transparent hover:ring-gray-200",
                )}
              >
                <img src={url} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        ) : null}

        {/* Title & location */}
        <div className="space-y-2">
          {!hasImages ? (
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                variant={turf.isAvailable === false ? "secondary" : "default"}
                className={cn(
                  turf.isAvailable !== false &&
                    "border-emerald-200 bg-emerald-600 text-white hover:bg-emerald-600",
                )}
              >
                {turf.isAvailable === false ? "Unavailable" : "Available"}
              </Badge>
              {turf.sportType?.map((sport) => (
                <Badge key={sport} variant="secondary">
                  {sport}
                </Badge>
              ))}
            </div>
          ) : null}
          <h2 className="text-xl font-bold tracking-tight text-gray-900">
            {turf.name}
          </h2>
          {turf.location?.address ? (
            <a
              href={getGoogleMapsUrl(turf.location)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-1.5 text-sm text-muted-foreground transition-colors hover:text-emerald-700"
            >
              <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
              <span className="underline-offset-2 hover:underline">
                {turf.location.address}
              </span>
            </a>
          ) : null}
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3">
          <TurfDetailStat
            icon={IndianRupee}
            label="Price per hour"
            value={`₹${turf.pricing?.basePricePerHour}/hr`}
          />
          <TurfDetailStat
            icon={Clock}
            label="Operating hours"
            value={
              turf.operatingHours?.open && turf.operatingHours?.close
                ? `${turf.operatingHours.open} – ${turf.operatingHours.close}`
                : "Not set"
            }
          />
          {dimensionsLabel ? (
            <TurfDetailStat
              icon={Ruler}
              label="Dimensions"
              value={dimensionsLabel}
            />
          ) : null}
          {turf.rating != null ? (
            <TurfDetailStat
              icon={Star}
              label="Rating"
              value={`${turf.rating}${turf.reviewCount != null ? ` (${turf.reviewCount} reviews)` : ""}`}
            />
          ) : null}
        </div>

        {/* Description */}
        {turf.description ? (
          <div className="rounded-xl bg-muted/60 p-4">
            <h3 className="text-sm font-semibold text-gray-900">About</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {turf.description}
            </p>
          </div>
        ) : null}

        {/* Amenities */}
        {turf.amenities && turf.amenities.length > 0 ? (
          <div className="space-y-2.5">
            <h3 className="text-sm font-semibold text-gray-900">Amenities</h3>
            <div className="flex flex-wrap gap-2">
              {turf.amenities.map((amenity) => (
                <Badge key={amenity} variant="outline">
                  {amenity}
                </Badge>
              ))}
            </div>
          </div>
        ) : null}
      </div>
      <div className="sticky bottom-0 z-10 shrink-0 border-t bg-background px-4 py-3">
        <TurfDetailActions
          onDelete={() => setDeleteDialogOpen(true)}
          onEdit={onEdit}
        />
      </div>

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete this turf?"
        description="This action cannot be undone. All listing data will be permanently removed."
        confirmLabel={deleteMutation.isPending ? "Deleting…" : "Yes, delete"}
        loading={deleteMutation.isPending}
        destructive
        onConfirm={() =>
          deleteMutation.mutate(id, {
            onSuccess: () => {
              setDeleteDialogOpen(false);
              onDeleteSuccess?.();
            },
          })
        }
      />
    </div>
  );
}
