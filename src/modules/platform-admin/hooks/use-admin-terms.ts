"use client";

import { toastError } from "@/lib/toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminTermsApi } from "../api/terms-and-conditions";
import { PLATFORM_ADMIN_QUERY_KEYS } from "../constants/query-keys";
import type {
  SaveTermsDraftPayload,
  TermsAndConditionsKindType,
  UpdateTermsDraftPayload,
} from "@/types/terms-and-conditions";

export function useAdminTerms(kind: TermsAndConditionsKindType) {
  return useQuery({
    queryKey: PLATFORM_ADMIN_QUERY_KEYS.adminTerms(kind),
    queryFn: () => adminTermsApi.list(kind),
  });
}

export function useCreateTermsDraft(kind: TermsAndConditionsKindType) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: SaveTermsDraftPayload) =>
      adminTermsApi.createDraft(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: PLATFORM_ADMIN_QUERY_KEYS.adminTerms(kind),
      });
    },
    onError: (error) =>
      toastError(error, "Failed to save the terms draft."),
  });
}

export function useUpdateTermsDraft(kind: TermsAndConditionsKindType) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateTermsDraftPayload;
    }) => adminTermsApi.updateDraft(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: PLATFORM_ADMIN_QUERY_KEYS.adminTerms(kind),
      });
    },
    onError: (error) =>
      toastError(error, "Failed to update the terms draft."),
  });
}

export function usePublishTerms(kind: TermsAndConditionsKindType) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminTermsApi.publish(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: PLATFORM_ADMIN_QUERY_KEYS.adminTerms(kind),
      });
    },
    onError: (error) =>
      toastError(error, "Failed to publish terms."),
  });
}
