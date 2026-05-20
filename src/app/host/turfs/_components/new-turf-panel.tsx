"use client";

import TurfForm from "./turf-form";
import { useCreateTurf } from "@/modules/host/hooks/use-turf-mutations";

export default function NewTurfPanel() {
  const createMutation = useCreateTurf();

  return (
    <div className="space-y-6">
      <TurfForm
        submitLabel="Create turf"
        isSubmitting={createMutation.isPending}
        onSubmit={(payload) => createMutation.mutate(payload)}
      />
    </div>
  );
}
