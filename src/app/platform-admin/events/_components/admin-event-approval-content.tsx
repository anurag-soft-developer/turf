"use client";

import { InfiniteScrollSentinel } from "@/components/infinite-scroll/infinite-scroll-sentinel";
import { ScrollableListPanel } from "@/components/infinite-scroll/scrollable-list-panel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { flattenPaginatedPages } from "@/lib/query/paginated-infinite";
import { eventStatusLabel, eventStatusVariant } from "@/lib/utils/event-display";
import { userDisplayName } from "@/lib/utils/withdrawal-display";
import type { HostEvent } from "@/modules/host/types/event";
import {
  useAdminEvent,
  useInfiniteAdminPendingEvents,
  useReviewEvent,
} from "@/modules/platform-admin/hooks/use-admin-event-approval";
import { format } from "date-fns";
import { CalendarDays, Check, ChevronRight, Loader2, MapPin, X } from "lucide-react";
import { useState } from "react";

function AdminPendingEventRow({
  event,
  onSelect,
}: {
  event: HostEvent;
  onSelect: (id: string) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(event._id)}
      className="block w-full text-left"
    >
      <Card className="transition-shadow hover:shadow-md">
        <CardContent className="flex items-center justify-between gap-4 pt-4">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-semibold text-gray-900">{event.title}</p>
              <Badge variant={eventStatusVariant(event.status)}>
                {eventStatusLabel(event.status)}
              </Badge>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {event.createdBy ? userDisplayName(event.createdBy) : "Unknown host"}
              {event.submittedAt
                ? ` · ${format(new Date(event.submittedAt), "MMM d, yyyy · HH:mm")}`
                : ""}
            </p>
            {event.location?.address ? (
              <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">
                {event.location.address}
              </p>
            ) : null}
          </div>
          <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
        </CardContent>
      </Card>
    </button>
  );
}

export function AdminEventApprovalDetailPanel({
  id,
  onReviewSuccess,
}: {
  id: string;
  onReviewSuccess?: () => void;
}) {
  const { data: event, isLoading, isError } = useAdminEvent(id);
  const reviewMutation = useReviewEvent();
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

  if (isError || !event) {
    return <p className="text-muted-foreground">Event not found.</p>;
  }

  const heroImage = event.coverImages?.[0];

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
            alt={event.title}
            className="aspect-[16/9] w-full object-cover"
          />
        </div>
      ) : (
        <div className="flex aspect-[16/9] items-center justify-center rounded-xl bg-indigo-50">
          <CalendarDays className="h-12 w-12 text-indigo-300" />
        </div>
      )}

      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-xl font-bold text-gray-900">{event.title}</h2>
          <Badge variant={eventStatusVariant(event.status)}>
            {eventStatusLabel(event.status)}
          </Badge>
        </div>
        {event.createdBy ? (
          <p className="text-sm text-muted-foreground">
            Host: {userDisplayName(event.createdBy)}
          </p>
        ) : null}
        {event.submittedAt ? (
          <p className="text-sm text-muted-foreground">
            Submitted {format(new Date(event.submittedAt), "MMM d, yyyy · HH:mm")}
          </p>
        ) : null}
        {event.eventDate ? (
          <p className="text-sm text-muted-foreground">
            Event date: {format(new Date(event.eventDate), "MMM d, yyyy")}
            {event.reportingTime ? ` · ${event.reportingTime}` : ""}
          </p>
        ) : null}
        {event.location?.address ? (
          <p className="flex items-start gap-1.5 text-sm text-muted-foreground">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
            {event.location.address}
          </p>
        ) : null}
        <p className="text-sm font-medium text-gray-900">
          {event.currency} {event.price}
        </p>
        <p className="text-sm text-muted-foreground">
          Participants: {event.registeredCount}/{event.maxParticipants}
        </p>
      </div>

      {event.description ? (
        <div className="rounded-xl bg-muted/60 p-4">
          <h3 className="text-sm font-semibold text-gray-900">Description</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {event.description}
          </p>
        </div>
      ) : null}

      <div className="sticky bottom-0 space-y-3 border-t bg-background pt-4">
        {showRejectForm ? (
          <div className="space-y-3">
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Reject this event</h3>
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
                placeholder="Explain what needs to be fixed..."
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
        description="This event will become visible to users on the public feed."
        confirmLabel={reviewMutation.isPending ? "Publishing..." : "Yes, publish"}
        loading={reviewMutation.isPending}
        onConfirm={handleApprove}
      />
    </div>
  );
}

export default function AdminEventApprovalsList({
  onSelectEvent,
}: {
  onSelectEvent: (id: string) => void;
}) {
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
  } = useInfiniteAdminPendingEvents();

  const events = flattenPaginatedPages(data?.pages);

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <div className="shrink-0">
        <h1 className="text-2xl font-bold text-gray-900">Event approvals</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Review events submitted by hosts for publication.
        </p>
      </div>

      <ScrollableListPanel className="mt-6 min-h-0 flex-1">
        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
          </div>
        ) : isError ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              Failed to load pending events.{" "}
              <button
                type="button"
                className="text-indigo-600 underline"
                onClick={() => refetch()}
              >
                Retry
              </button>
            </CardContent>
          </Card>
        ) : events.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
              <CalendarDays className="h-12 w-12 text-gray-300" />
              <div>
                <p className="font-semibold text-gray-900">No pending events</p>
                <p className="text-sm text-muted-foreground">
                  All submitted events have been reviewed.
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="flex flex-col gap-4 pb-4">
            {isFetching && !isLoading && !isFetchingNextPage ? (
              <p className="text-sm text-muted-foreground">Refreshing...</p>
            ) : null}
            {events.map((event) => (
              <AdminPendingEventRow
                key={event._id}
                event={event}
                onSelect={onSelectEvent}
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
    </div>
  );
}
