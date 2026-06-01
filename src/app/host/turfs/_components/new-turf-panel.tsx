"use client";

import TurfForm from "./turf-form";
import { useCreateTurf } from "@/modules/host/hooks/use-turf-mutations";

interface NewTurfPanelProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function NewTurfPanel({ onSuccess, onCancel }: NewTurfPanelProps) {
  const createMutation = useCreateTurf();

  return (
    <TurfForm
      submitLabel="Create turf"
      isSubmitting={createMutation.isPending}
      onCancel={onCancel}
      onSubmit={(payload) =>
        createMutation.mutate(payload, { onSuccess: () => onSuccess?.() })
      }
    />
  );
}
