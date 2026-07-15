"use client";

import { toastError } from "@/lib/toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { hostEventApi } from "../api/events";
import { HOST_QUERY_KEYS } from "../constants/query-keys";
import type { CreateEventPayload, UpdateEventPayload } from "../types/event";

function invalidateHostEventQueries(
  queryClient: ReturnType<typeof useQueryClient>,
  id?: string,
) {
  queryClient.invalidateQueries({ queryKey: ["host", "events"] });
  queryClient.invalidateQueries({ queryKey: HOST_QUERY_KEYS.eventStats });
  if (id) {
    queryClient.invalidateQueries({ queryKey: HOST_QUERY_KEYS.event(id) });
  }
}

export function useCreateEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateEventPayload) => hostEventApi.create(payload),
    onSuccess: () => {
      invalidateHostEventQueries(queryClient);
    },
    onError: (error) =>
      toastError(error, "Failed to create event. Please try again."),
  });
}

export function useUpdateEvent(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateEventPayload) => hostEventApi.update(id, payload),
    onSuccess: () => {
      invalidateHostEventQueries(queryClient, id);
    },
    onError: (error) =>
      toastError(error, "Failed to update event. Please try again."),
  });
}

export function useDeleteEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => hostEventApi.delete(id),
    onSuccess: () => {
      invalidateHostEventQueries(queryClient);
    },
    onError: (error) =>
      toastError(error, "Failed to delete event. Please try again."),
  });
}

export function useSubmitEventForApproval() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => hostEventApi.submitForApproval(id),
    onSuccess: (_, id) => {
      invalidateHostEventQueries(queryClient, id);
    },
    onError: (error) => toastError(error, "Failed to submit event for approval."),
  });
}

export function useWithdrawEventSubmission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => hostEventApi.withdrawSubmission(id),
    onSuccess: (_, id) => {
      invalidateHostEventQueries(queryClient, id);
    },
    onError: (error) => toastError(error, "Failed to withdraw event submission."),
  });
}

export function useCloseEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => hostEventApi.close(id),
    onSuccess: (_, id) => {
      invalidateHostEventQueries(queryClient, id);
    },
    onError: (error) => toastError(error, "Failed to close event."),
  });
}

export function useToggleEventRegistrations() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      registrationsPaused,
    }: {
      id: string;
      registrationsPaused: boolean;
    }) => hostEventApi.update(id, { registrationsPaused }),
    onSuccess: (_, { id }) => {
      invalidateHostEventQueries(queryClient, id);
    },
    onError: (error) =>
      toastError(error, "Failed to update registrations. Please try again."),
  });
}
