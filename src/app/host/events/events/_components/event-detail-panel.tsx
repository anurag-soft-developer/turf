"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { cn } from "@/lib/utils";
import {
  eventRegistrationHoldActionLabel,
  eventRegistrationHoldBadgeClassName,
  eventRegistrationHoldLabel,
  eventStatusLabel,
  eventStatusVariant,
  isEventOpenForRegistrations,
} from "@/lib/utils/event-display";
import { useHostEvent } from "@/modules/host/hooks/use-my-events";
import {
  useCloseEvent,
  useDeleteEvent,
  useSubmitEventForApproval,
  useToggleEventRegistrations,
  useWithdrawEventSubmission,
} from "@/modules/host/hooks/use-event-mutations";
import { format } from "date-fns";
import {
  CalendarDays,
  IndianRupee,
  Loader2,
  MapPin,
  PauseCircle,
  Pencil,
  PlayCircle,
  Send,
  Trash2,
  Undo2,
  UserRound,
} from "lucide-react";
import { useState } from "react";

interface EventDetailPanelProps {
  id: string;
  onEdit?: () => void;
  onDeleteSuccess?: () => void;
}

function formatEventDate(value?: string) {
  if (!value) return "Not set";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not set";
  return format(date, "MMM d, yyyy");
}

function EventDetailStat({
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

export default function EventDetailPanel({
  id,
  onEdit,
  onDeleteSuccess,
}: EventDetailPanelProps) {
  const { data: event, isLoading, isError } = useHostEvent(id);
  const deleteMutation = useDeleteEvent();
  const submitMutation = useSubmitEventForApproval();
  const withdrawMutation = useWithdrawEventSubmission();
  const closeMutation = useCloseEvent();
  const toggleRegistrations = useToggleEventRegistrations();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [submitDialogOpen, setSubmitDialogOpen] = useState(false);
  const [withdrawDialogOpen, setWithdrawDialogOpen] = useState(false);
  const [closeDialogOpen, setCloseDialogOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (isError || !event) {
    return (
      <div className="flex flex-col items-center gap-2 py-16 text-center">
        <CalendarDays className="h-10 w-10 text-gray-300" />
        <p className="text-muted-foreground">Event not found.</p>
      </div>
    );
  }

  const resolvedStatus = event.status ?? "draft";
  const showSubmit = resolvedStatus === "draft" || resolvedStatus === "rejected";
  const showWithdraw = resolvedStatus === "pending_approval";
  const showClose = resolvedStatus === "published" && !event.isClosed;
  const registrationsOpen = isEventOpenForRegistrations(event.registrationsPaused);

  return (
    <div className="-mx-4 flex min-h-full flex-col">
      <div className="space-y-5 px-4 py-4 pb-2">
        <div className="space-y-2">
          <h2 className="text-xl font-bold tracking-tight text-gray-900">{event.title}</h2>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={eventStatusVariant(event.status)}>
              {eventStatusLabel(event.status)}
            </Badge>
            <Badge
              variant="outline"
              className={eventRegistrationHoldBadgeClassName(
                event.registrationsPaused,
              )}
            >
              {eventRegistrationHoldLabel(event.registrationsPaused)}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {formatEventDate(event.eventDate)}
              {event.reportingTime ? ` at ${event.reportingTime}` : ""}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <EventDetailStat
            icon={IndianRupee}
            label="Price"
            value={`${event.currency} ${event.price}`}
          />
          <EventDetailStat
            icon={UserRound}
            label="Participants"
            value={`${event.registeredCount}/${event.maxParticipants}`}
          />
        </div>

        {event.location?.address ? (
          <div className="rounded-xl bg-muted/60 p-4">
            <h3 className="text-sm font-semibold text-gray-900">Location</h3>
            <p className="mt-2 flex items-start gap-1.5 text-sm text-muted-foreground">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
              {event.location.address}
            </p>
          </div>
        ) : null}

        {event.description ? (
          <div className="rounded-xl bg-muted/60 p-4">
            <h3 className="text-sm font-semibold text-gray-900">Description</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {event.description}
            </p>
          </div>
        ) : null}

        {event.rejectionReason ? (
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
            <p className="font-medium">Rejection reason</p>
            <p className="mt-1 text-destructive/90">{event.rejectionReason}</p>
          </div>
        ) : null}
      </div>

      <div className="sticky bottom-0 z-10 shrink-0 border-t bg-background px-4 py-3">
        <div className="flex flex-wrap justify-end gap-2">
          {showSubmit ? (
            <Button
              type="button"
              size="sm"
              onClick={() => setSubmitDialogOpen(true)}
              disabled={submitMutation.isPending}
              className="gap-1.5 bg-emerald-600 hover:bg-emerald-700"
            >
              {submitMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              {resolvedStatus === "rejected" ? "Resubmit" : "Submit"}
            </Button>
          ) : null}

          {showWithdraw ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setWithdrawDialogOpen(true)}
              disabled={withdrawMutation.isPending}
              className="gap-1.5"
            >
              {withdrawMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Undo2 className="h-4 w-4" />
              )}
              Withdraw
            </Button>
          ) : null}

          {showClose ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setCloseDialogOpen(true)}
              disabled={closeMutation.isPending}
            >
              Close event
            </Button>
          ) : null}

          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={toggleRegistrations.isPending}
            onClick={() =>
              toggleRegistrations.mutate({
                id,
                registrationsPaused: registrationsOpen,
              })
            }
            className={cn(
              "gap-1.5",
              registrationsOpen
                ? "border-amber-200 text-amber-800 hover:bg-amber-50"
                : "border-emerald-200 text-emerald-700 hover:bg-emerald-50",
            )}
          >
            {toggleRegistrations.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : registrationsOpen ? (
              <PauseCircle className="h-4 w-4" />
            ) : (
              <PlayCircle className="h-4 w-4" />
            )}
            {eventRegistrationHoldActionLabel(event.registrationsPaused)}
          </Button>

          <Button type="button" variant="outline" size="sm" onClick={onEdit} className="gap-1.5">
            <Pencil className="h-4 w-4" />
            Edit
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setDeleteDialogOpen(true)}
            className="gap-1.5 text-destructive hover:bg-destructive/5 hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      <ConfirmDialog
        open={submitDialogOpen}
        onOpenChange={setSubmitDialogOpen}
        title={resolvedStatus === "rejected" ? "Resubmit for approval?" : "Submit for approval?"}
        description="Your event will be sent to platform admins for review."
        confirmLabel={submitMutation.isPending ? "Submitting..." : "Yes, submit"}
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
        description="Your event will return to draft status so you can edit and submit again."
        confirmLabel={withdrawMutation.isPending ? "Withdrawing..." : "Yes, withdraw"}
        loading={withdrawMutation.isPending}
        onConfirm={() =>
          withdrawMutation.mutate(id, {
            onSuccess: () => setWithdrawDialogOpen(false),
          })
        }
      />

      <ConfirmDialog
        open={closeDialogOpen}
        onOpenChange={setCloseDialogOpen}
        title="Close this event?"
        description="Closing the event stops new registrations and cannot be undone."
        confirmLabel={closeMutation.isPending ? "Closing..." : "Yes, close"}
        loading={closeMutation.isPending}
        onConfirm={() =>
          closeMutation.mutate(id, {
            onSuccess: () => setCloseDialogOpen(false),
          })
        }
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete this event?"
        description="This action cannot be undone."
        confirmLabel={deleteMutation.isPending ? "Deleting..." : "Yes, delete"}
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
