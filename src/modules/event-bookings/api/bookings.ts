import api from "@/lib/api/client";
import { API_CONFIG } from "@/lib/constants/api";
import type { PaginatedResponse } from "@/types/common";
import type {
  CreateEventBookingOrderResponse,
  CreateEventBookingPayload,
  EventBooking,
  MyEventBookingsFilter,
  VerifyHostedPaymentPayload,
} from "../types/booking";

export const eventBookingsApi = {
  getMyBookings: async (
    params: MyEventBookingsFilter = {},
  ): Promise<PaginatedResponse<EventBooking>> => {
    const response = await api.get<PaginatedResponse<EventBooking>>(
      API_CONFIG.ENDPOINTS.EVENT_BOOKINGS.USER_BOOKINGS,
      { params },
    );
    return response.data;
  },

  getMyBooking: async (eventId: string): Promise<EventBooking | null> => {
    const response = await api.get<EventBooking | null>(
      API_CONFIG.ENDPOINTS.EVENT_BOOKINGS.ME(eventId),
    );
    return response.data;
  },

  createOrder: async (
    eventId: string,
    payload: CreateEventBookingPayload,
    options?: { paymentLink?: boolean },
  ): Promise<CreateEventBookingOrderResponse> => {
    const response = await api.post<CreateEventBookingOrderResponse>(
      API_CONFIG.ENDPOINTS.EVENT_BOOKINGS.CREATE_ORDER(eventId),
      payload,
      {
        params: options?.paymentLink ? { paymentLink: "true" } : undefined,
      },
    );
    return response.data;
  },

  verifyHostedPayment: async (
    eventId: string,
    payload: VerifyHostedPaymentPayload,
  ): Promise<EventBooking> => {
    const response = await api.post<EventBooking>(
      API_CONFIG.ENDPOINTS.EVENT_BOOKINGS.VERIFY_HOSTED(eventId),
      payload,
    );
    return response.data;
  },
};
