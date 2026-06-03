"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { userDisplayName } from "@/lib/utils/withdrawal-display";
import {
  turfStatusLabel,
  turfStatusVariant,
} from "@/lib/utils/turf-display";
import type { Turf } from "@/modules/host/types/turf";
import {
  useAdminPendingTurfs,
  useAdminTurf,
  useReviewTurf,
} from "@/modules/platform-admin/hooks/use-admin-turf-approval";
import { format } from "date-fns";
import { Check, ChevronRight, Loader2, MapPin, X } from "lucide-react";
import { useState } from "react";

function AdminPendingTurfRow({
  turf,
  onSelect,
}: {
  turf: Turf;
  onSelect: (id: string) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(turf._id)}
      className="block w-full text-left"
    >
      <Card className="transition-shadow hover:shadow-md">
        <CardContent className="flex items-center justify-between gap-4 pt-4">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-semibold text-gray-900">{turf.name}</p>
              <Badge variant={turfStatusVariant(turf.status)}>
                {turfStatusLabel(turf.status)}
              </Badge>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {turf.postedBy ? userDisplayName(turf.postedBy) : "Unknown host"}
              {turf.submittedAt
                ? ` · ${format(new Date(turf.submittedAt), "MMM d, yyyy · HH:mm")}`
                : ""}
            </p>
            {turf.location?.address ? (
              <p className="mt-1 text-sm text-muted-foreground line-clamp-1">
                {turf.location.address}
              </p>
            ) : null}
          </div>
          <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
        </CardContent>
      </Card>
    </button>
  );
}

export function AdminTurfApprovalDetailPanel({
  id,
  onReviewSuccess,
}: {
  id: string;
  onReviewSuccess?: () => void;
}) {
  const { data: turf, isLoading, isError } = useAdminTurf(id);
  const reviewMutation = useReviewTurf();
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [rejectError, setRejectError] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (isError || !turf) {
    return <p className="text-muted-foreground">Turf not found.</p>;
  }

  const heroImage = turf.images?.[0];

  const handleApprove = () => {
    reviewMutation.mutate(
      { id, payload: { action: "publish" } },
      {
        onSuccess: () => {
          setApproveDialogOpen(false);
          onReviewSuccess?.();
        },
      },
    );
  };

  const handleReject = () => {
    const trimmed = rejectionReason.trim();
    if (!trimmed) {
      setRejectError("Rejection reason is required.");
      return;
    }
    setRejectError(null);
    reviewMutation.mutate(
      { id, payload: { action: "reject", rejectionReason: trimmed } },
      {
        onSuccess: () => {
          setShowRejectForm(false);
          setRejectionReason("");
          onReviewSuccess?.();
        },
      },
    );
  };

  return (
    <div className="space-y-5 px-1">
      {heroImage ? (
        <div className="overflow-hidden rounded-xl">
          <img
            src={heroImage}
            alt={turf.name}
            className="aspect-[16/9] w-full object-cover"
          />
        </div>
      ) : (
        <div className="flex aspect-[16/9] items-center justify-center rounded-xl bg-indigo-50">
          <MapPin className="h-12 w-12 text-indigo-300" />
        </div>
      )}

      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-xl font-bold text-gray-900">{turf.name}</h2>
          <Badge variant={turfStatusVariant(turf.status)}>
            {turfStatusLabel(turf.status)}
          </Badge>
        </div>
        {turf.postedBy ? (
          <p className="text-sm text-muted-foreground">
            Host: {userDisplayName(turf.postedBy)}
          </p>
        ) : null}
        {turf.submittedAt ? (
          <p className="text-sm text-muted-foreground">
            Submitted{" "}
            {format(new Date(turf.submittedAt), "MMM d, yyyy · HH:mm")}
          </p>
        ) : null}
        {turf.location?.address ? (
          <p className="text-sm text-muted-foreground">{turf.location.address}</p>
        ) : null}
        <p className="text-sm font-medium text-gray-900">
          ₹{turf.pricing?.basePricePerHour}/hr
        </p>
        {turf.sportType?.length ? (
          <div className="flex flex-wrap gap-2">
            {turf.sportType.map((sport) => (
              <Badge key={sport} variant="secondary">
                {sport}
              </Badge>
            ))}
          </div>
        ) : null}
      </div>

      {turf.description ? (
        <div className="rounded-xl bg-muted/60 p-4">
          <h3 className="text-sm font-semibold text-gray-900">Description</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {turf.description}
          </p>
        </div>
      ) : null}

      {turf.amenities && turf.amenities.length > 0 ? (
        <div className="space-y-2">
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

      <div className="sticky bottom-0 space-y-3 border-t bg-background pt-4">
        {showRejectForm ? (
          <div className="space-y-3">
            <div>
              <h3 className="text-sm font-semibold text-gray-900">
                Reject this turf
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                The host will see your reason and can edit and resubmit.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="rejection-reason">Rejection reason</Label>
              <Textarea
                id="rejection-reason"
                value={rejectionReason}
                onChange={(e) => {
                  setRejectionReason(e.target.value);
                  setRejectError(null);
                }}
                placeholder="Explain what needs to be fixed…"
                rows={4}
                maxLength={2000}
                autoFocus
              />
              {rejectError ? (
                <p className="text-sm text-destructive">{rejectError}</p>
              ) : null}
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setShowRejectForm(false);
                  setRejectionReason("");
                  setRejectError(null);
                }}
                disabled={reviewMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                type="button"
                size="sm"
                className="gap-1.5 bg-destructive text-white hover:bg-destructive/90"
                onClick={handleReject}
                disabled={reviewMutation.isPending}
              >
                {reviewMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <X className="h-4 w-4" />
                )}
                Confirm reject
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              size="sm"
              className="gap-1.5 bg-indigo-600 hover:bg-indigo-700"
              onClick={() => setApproveDialogOpen(true)}
              disabled={reviewMutation.isPending}
            >
              <Check className="h-4 w-4" />
              Approve & publish
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-1.5 text-destructive hover:bg-destructive/5"
              onClick={() => {
                setRejectError(null);
                setShowRejectForm(true);
              }}
              disabled={reviewMutation.isPending}
            >
              <X className="h-4 w-4" />
              Reject
            </Button>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={approveDialogOpen}
        onOpenChange={setApproveDialogOpen}
        title="Approve and publish?"
        description="This turf will become visible to users on the public feed."
        confirmLabel={reviewMutation.isPending ? "Publishing…" : "Yes, publish"}
        loading={reviewMutation.isPending}
        onConfirm={handleApprove}
      />
    </div>
  );
}

export default function AdminTurfApprovalsList({
  onSelectTurf,
}: {
  onSelectTurf: (id: string) => void;
}) {
  const { data, isLoading, isError, refetch, isFetching } =
    useAdminPendingTurfs({ limit: 50 });

  const turfs = data?.data ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Turf approvals</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Review turf listings submitted by hosts for publication.
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        </div>
      ) : isError ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            Failed to load pending turfs.{" "}
            <button
              type="button"
              className="text-indigo-600 underline"
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
              <p className="font-semibold text-gray-900">No pending turfs</p>
              <p className="text-sm text-muted-foreground">
                All submitted listings have been reviewed.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-4">
          {isFetching && !isLoading ? (
            <p className="text-sm text-muted-foreground">Refreshing…</p>
          ) : null}
          {turfs.map((turf) => (
            <AdminPendingTurfRow
              key={turf._id}
              turf={turf}
              onSelect={onSelectTurf}
            />
          ))}
        </div>
      )}
    </div>
  );
}
