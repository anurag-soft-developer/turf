"use client";

import TurfForm from "./turf-form";
import { useHostTurf } from "@/modules/host/hooks/use-my-turfs";
import { useUpdateTurf } from "@/modules/host/hooks/use-turf-mutations";
import { Loader2 } from "lucide-react";

interface EditTurfPanelProps {
  id: string;
}

export default function EditTurfPanel({ id }: EditTurfPanelProps) {
  const { data: turf, isLoading, isError } = useHostTurf(id);
  const updateMutation = useUpdateTurf(id);

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (isError || !turf) {
    return <p className="text-muted-foreground">Turf not found.</p>;
  }

  return (
    <TurfForm
      turf={turf}
      submitLabel="Update turf"
      isSubmitting={updateMutation.isPending}
      onSubmit={(payload) => updateMutation.mutate(payload)}
    />
  );
}
