"use client";

import { toastError } from "@/lib/toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { hostTurfApi } from "../api/turf";
import { HOST_QUERY_KEYS } from "../constants/query-keys";
import type { CreateTurfPayload, UpdateTurfPayload } from "../types/turf";

export function useCreateTurf() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateTurfPayload) => hostTurfApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["host", "turfs"] });
      queryClient.invalidateQueries({ queryKey: HOST_QUERY_KEYS.turfStats });
    },
    onError: (error) =>
      toastError(error, "Failed to create turf. Please try again."),
  });
}

export function useUpdateTurf(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateTurfPayload) => hostTurfApi.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["host", "turfs"] });
      queryClient.invalidateQueries({ queryKey: HOST_QUERY_KEYS.turf(id) });
    },
    onError: (error) =>
      toastError(error, "Failed to update turf. Please try again."),
  });
}

export function useToggleTurfAvailability() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      isAvailable,
    }: {
      id: string;
      isAvailable: boolean;
    }) => hostTurfApi.update(id, { isAvailable }),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["host", "turfs"] });
      queryClient.invalidateQueries({ queryKey: HOST_QUERY_KEYS.turf(id) });
    },
    onError: (error) =>
      toastError(error, "Failed to update availability. Please try again."),
  });
}

export function useDeleteTurf() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => hostTurfApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["host", "turfs"] });
      queryClient.invalidateQueries({ queryKey: HOST_QUERY_KEYS.turfStats });
    },
    onError: (error) =>
      toastError(error, "Failed to delete turf. Please try again."),
  });
}

function invalidateHostTurfQueries(
  queryClient: ReturnType<typeof useQueryClient>,
  id?: string,
) {
  queryClient.invalidateQueries({ queryKey: ["host", "turfs"] });
  if (id) {
    queryClient.invalidateQueries({ queryKey: HOST_QUERY_KEYS.turf(id) });
  }
}

export function useSubmitTurfForApproval() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => hostTurfApi.submitForApproval(id),
    onSuccess: (_, id) => {
      invalidateHostTurfQueries(queryClient, id);
    },
    onError: (error) =>
      toastError(error, "Failed to submit turf for approval."),
  });
}

export function useWithdrawTurfSubmission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => hostTurfApi.withdrawSubmission(id),
    onSuccess: (_, id) => {
      invalidateHostTurfQueries(queryClient, id);
    },
    onError: (error) =>
      toastError(error, "Failed to withdraw submission."),
  });
}
