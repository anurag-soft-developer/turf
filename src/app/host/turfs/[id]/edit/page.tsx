"use client";

import TurfForm from "../../_components/turf-form";
import { useHostTurf } from "@/modules/host/hooks/use-my-turfs";
import { useUpdateTurf } from "@/modules/host/hooks/use-turf-mutations";
import { Loader2 } from "lucide-react";
import { use } from "react";

export default function EditTurfPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
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
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900">Edit turf</h2>
      <TurfForm
        turf={turf}
        submitLabel="Update turf"
        isSubmitting={updateMutation.isPending}
        onSubmit={(payload) => updateMutation.mutate(payload)}
      />
    </div>
  );
}
