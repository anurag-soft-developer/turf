"use client";

import EventForm from "./event-form";
import { useHostEvent } from "@/modules/host/hooks/use-my-events";
import { useUpdateEvent } from "@/modules/host/hooks/use-event-mutations";
import { Loader2 } from "lucide-react";

interface EditEventPanelProps {
  id: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function EditEventPanel({
  id,
  onSuccess,
  onCancel,
}: EditEventPanelProps) {
  const { data: event, isLoading, isError } = useHostEvent(id);
  const updateMutation = useUpdateEvent(id);

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (isError || !event) {
    return <p className="text-muted-foreground">Event not found.</p>;
  }

  return (
    <EventForm
      event={event}
      submitLabel="Update event"
      isSubmitting={updateMutation.isPending}
      onCancel={onCancel}
      onSubmit={(payload) =>
        updateMutation.mutate(payload, { onSuccess: () => onSuccess?.() })
      }
    />
  );
}
