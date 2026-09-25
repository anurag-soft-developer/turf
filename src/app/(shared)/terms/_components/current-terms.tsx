"use client";

import { hostTurfApi } from "@/modules/turf-host/api/turf";
import type { TermsAndConditionsKindType } from "@/types/terms-and-conditions";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Loader2 } from "lucide-react";

export function CurrentTerms({ kind }: { kind: TermsAndConditionsKindType }) {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["terms-and-conditions", "current", kind],
    queryFn: () => hostTurfApi.getCurrentOwnerTerms(kind),
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  const notPublished =
    isError && axios.isAxiosError(error) && error.response?.status === 404;

  if (notPublished) {
    return (
      <p className="mt-6 text-gray-600">
        Terms and conditions are not published yet.
      </p>
    );
  }

  if (isError || !data) {
    return (
      <p className="mt-6 text-gray-600">Could not load terms and conditions.</p>
    );
  }

  return (
    <article className="mt-8 rounded-xl border bg-white p-6">
      <h2 className="text-xl font-semibold text-gray-900">{data.title}</h2>
      <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-gray-600">
        {data.content}
      </p>
    </article>
  );
}
