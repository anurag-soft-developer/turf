"use client";

import TurfForm from "../_components/turf-form";
import { useCreateTurf } from "@/modules/host/hooks/use-turf-mutations";

export default function NewTurfPage() {
  const createMutation = useCreateTurf();

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900">Add new turf</h2>
      <TurfForm
        submitLabel="Create turf"
        isSubmitting={createMutation.isPending}
        onSubmit={(payload) => createMutation.mutate(payload)}
      />
    </div>
  );
}
