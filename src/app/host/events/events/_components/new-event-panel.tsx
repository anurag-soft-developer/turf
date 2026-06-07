"use client";

import EventForm from "./event-form";
import { useCreateEvent } from "@/modules/host/hooks/use-event-mutations";

interface NewEventPanelProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function NewEventPanel({ onSuccess, onCancel }: NewEventPanelProps) {
  const createMutation = useCreateEvent();

  return (
    <EventForm
      submitLabel="Create event"
      isSubmitting={createMutation.isPending}
      onCancel={onCancel}
      onSubmit={(payload) =>
        createMutation.mutate(payload, { onSuccess: () => onSuccess?.() })
      }
    />
  );
}
