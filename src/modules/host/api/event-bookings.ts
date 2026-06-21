import api from "@/lib/api/client";
import { API_CONFIG } from "@/lib/constants/api";
import type { PaginatedResponse } from "../../../types/common";
import type {
  EventBookingStatus,
  OwnerEventBooking,
  OwnerEventBookingsFilter,
  UpdateOwnerEventBookingPayload,
} from "../types/owner-event-booking";

export const hostEventBookingsApi = {
  getOwnerBookings: async (
    params: OwnerEventBookingsFilter = {},
  ): Promise<PaginatedResponse<OwnerEventBooking>> => {
    const response = await api.get<PaginatedResponse<OwnerEventBooking>>(
      API_CONFIG.ENDPOINTS.EVENT_BOOKINGS.OWNER_BOOKINGS,
      { params },
    );
    return response.data;
  },

  getById: async (id: string): Promise<OwnerEventBooking> => {
    const response = await api.get<OwnerEventBooking>(
      API_CONFIG.ENDPOINTS.EVENT_BOOKINGS.BY_ID(id),
    );
    return response.data;
  },

  update: async (
    id: string,
    payload: UpdateOwnerEventBookingPayload,
  ): Promise<OwnerEventBooking> => {
    const response = await api.patch<OwnerEventBooking>(
      API_CONFIG.ENDPOINTS.EVENT_BOOKINGS.BY_ID(id),
      payload,
    );
    return response.data;
  },

  confirm: (id: string) =>
    hostEventBookingsApi.update(id, { status: "confirmed" as EventBookingStatus }),

  complete: (id: string) =>
    hostEventBookingsApi.update(id, { status: "completed" as EventBookingStatus }),

  cancel: (id: string, cancelReason: string) =>
    hostEventBookingsApi.update(id, {
      status: "cancelled" as EventBookingStatus,
      cancelReason,
    }),
};
