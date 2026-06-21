"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { eventBookingsApi } from "../api/bookings";
import { EVENT_BOOKINGS_QUERY_KEYS } from "../constants/query-keys";
import type {
  CreateEventBookingPayload,
  VerifyHostedPaymentPayload,
} from "../types/booking";

export function useCreateEventBookingOrder(eventId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateEventBookingPayload) =>
      eventBookingsApi.createOrder(eventId, payload, { paymentLink: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: EVENT_BOOKINGS_QUERY_KEYS.myBooking(eventId),
      });
    },
  });
}

export function useVerifyEventHostedPayment(eventId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: VerifyHostedPaymentPayload) =>
      eventBookingsApi.verifyHostedPayment(eventId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: EVENT_BOOKINGS_QUERY_KEYS.myBooking(eventId),
      });
    },
  });
}
