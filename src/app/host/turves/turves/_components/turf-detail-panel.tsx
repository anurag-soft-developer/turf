"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { useHostTurf } from "@/modules/host/hooks/use-my-turfs";
import {
  useDeleteTurf,
  useSubmitTurfForApproval,
  useToggleTurfAvailability,
  useWithdrawTurfSubmission,
} from "@/modules/host/hooks/use-turf-mutations";
import type { TurfStatus } from "@/modules/host/types/turf";
import { cn } from "@/lib/utils";
import {
  isTurfOpenForBookings,
  turfBookingHoldActionLabel,
  turfBookingHoldBadgeClassName,
  turfBookingHoldLabel,
  turfStatusLabel,
  turfStatusVariant,
} from "@/lib/utils/turf-display";
import { format } from "date-fns";
import {
  Clock,
  IndianRupee,
  Loader2,
  MapPin,
  PauseCircle,
  Pencil,
  PlayCircle,
  Ruler,
  Send,
  Star,
  Trash2,
  Undo2,
} from "lucide-react";
import { useState } from "react";
import type { GeoLocation } from "@/types/common";
import { getGoogleMapsUrl } from "@/lib/maps/google-maps-url";

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
    <div className="flex items-center gap-3 rounded-xl border bg-card p-3.5">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <p className="mt-0.5 text-sm font-semibold text-gray-900">{value}</p>
      </div>
    </div>
  );
}

function TurfDetailActions({
  status,
  isAvailable,
  onDelete,
  onEdit,
  onToggleAvailability,
  onSubmit,
  onWithdraw,
  isSubmitting,
  isWithdrawing,
  isTogglingAvailability,
}: {
  status: TurfStatus | undefined;
  isAvailable: boolean;
  onDelete: () => void;
  onEdit?: () => void;
  onToggleAvailability?: () => void;
  onSubmit?: () => void;
  onWithdraw?: () => void;
  isSubmitting?: boolean;
  isWithdrawing?: boolean;
  isTogglingAvailability?: boolean;
}) {
  const resolvedStatus = status ?? "draft";
  const showSubmit =
    resolvedStatus === "draft" || resolvedStatus === "rejected";
  const showWithdraw = resolvedStatus === "pending_approval";

  return (
    <div className="flex flex-col gap-2">
      {resolvedStatus === "pending_approval" ? (
        <p className="text-xs text-muted-foreground">
          Your listing is under review. You can withdraw to make changes.
        </p>
      ) : null}
      <div className="flex flex-wrap gap-2 justify-end">
        {showSubmit ? (
          <Button
            type="button"
            size="sm"
            onClick={onSubmit}
            disabled={isSubmitting}
            className="gap-1.5 bg-emerald-600 hover:bg-emerald-700"
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            {resolvedStatus === "rejected"
              ? "Resubmit for approval"
              : "Submit for approval"}
          </Button>
        ) : null}
        {showWithdraw ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onWithdraw}
            disabled={isWithdrawing}
            className="gap-1.5"
          >
            {isWithdrawing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Undo2 className="h-4 w-4" />
            )}
            Withdraw submission
          </Button>
        ) : null}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onToggleAvailability}
          disabled={isTogglingAvailability}
          className={cn(
            "gap-1.5",
            isAvailable
              ? "border-amber-200 text-amber-800 hover:bg-amber-50"
              : "border-emerald-200 text-emerald-700 hover:bg-emerald-50",
          )}
        >
          {isTogglingAvailability ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : isAvailable ? (
            <PauseCircle className="h-4 w-4" />
          ) : (
            <PlayCircle className="h-4 w-4" />
          )}
          {turfBookingHoldActionLabel(isAvailable)}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onEdit}
          className="gap-1.5"
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
  const submitMutation = useSubmitTurfForApproval();
  const withdrawMutation = useWithdrawTurfSubmission();
  const toggleAvailability = useToggleTurfAvailability();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [submitDialogOpen, setSubmitDialogOpen] = useState(false);
  const [withdrawDialogOpen, setWithdrawDialogOpen] = useState(false);
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
  const isAvailable = isTurfOpenForBookings(turf.isAvailable);

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
                    variant="outline"
                    className={turfBookingHoldBadgeClassName(turf.isAvailable)}
                  >
                    {turfBookingHoldLabel(turf.isAvailable)}
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
              {turf.status === "published" && (
                <Badge
                  variant="outline"
                  className={turfBookingHoldBadgeClassName(turf.isAvailable)}
                >
                  {turfBookingHoldLabel(turf.isAvailable)}
                </Badge>
              )}
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
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={turfStatusVariant(turf.status)}>
              {turfStatusLabel(turf.status)}
            </Badge>
            {turf.submittedAt ? (
              <span className="text-xs text-muted-foreground">
                Submitted{" "}
                {format(new Date(turf.submittedAt), "MMM d, yyyy · HH:mm")}
              </span>
            ) : null}
            {turf.reviewedAt ? (
              <span className="text-xs text-muted-foreground">
                Reviewed{" "}
                {format(new Date(turf.reviewedAt), "MMM d, yyyy · HH:mm")}
              </span>
            ) : null}
          </div>
          {turf.status === "rejected" && turf.rejectionReason ? (
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
              <p className="font-medium">Rejection reason</p>
              <p className="mt-1 text-destructive/90">{turf.rejectionReason}</p>
            </div>
          ) : null}
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
          status={turf.status}
          isAvailable={isAvailable}
          onDelete={() => setDeleteDialogOpen(true)}
          onEdit={onEdit}
          onToggleAvailability={() =>
            toggleAvailability.mutate({
              id,
              isAvailable: !isAvailable,
            })
          }
          onSubmit={() => setSubmitDialogOpen(true)}
          onWithdraw={() => setWithdrawDialogOpen(true)}
          isSubmitting={submitMutation.isPending}
          isWithdrawing={withdrawMutation.isPending}
          isTogglingAvailability={toggleAvailability.isPending}
        />
      </div>

      <ConfirmDialog
        open={submitDialogOpen}
        onOpenChange={setSubmitDialogOpen}
        title={
          turf.status === "rejected"
            ? "Resubmit for approval?"
            : "Submit for approval?"
        }
        description="Your turf will be sent to platform admins for review. You will not be able to publish it publicly until it is approved."
        confirmLabel={submitMutation.isPending ? "Submitting…" : "Yes, submit"}
        loading={submitMutation.isPending}
        onConfirm={() =>
          submitMutation.mutate(id, {
            onSuccess: () => setSubmitDialogOpen(false),
          })
        }
      />

      <ConfirmDialog
        open={withdrawDialogOpen}
        onOpenChange={setWithdrawDialogOpen}
        title="Withdraw submission?"
        description="Your turf will return to draft status. You can edit it and submit again when ready."
        confirmLabel={
          withdrawMutation.isPending ? "Withdrawing…" : "Yes, withdraw"
        }
        loading={withdrawMutation.isPending}
        onConfirm={() =>
          withdrawMutation.mutate(id, {
            onSuccess: () => setWithdrawDialogOpen(false),
          })
        }
      />

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
