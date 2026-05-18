import api from "@/lib/api/client";
import { API_CONFIG } from "@/lib/constants/api";
import type { PaginatedResponse } from "../../../types/common";
import type {
  OwnerBooking,
  OwnerBookingsFilter,
  TurfBookingStatus,
  UpdateOwnerBookingPayload,
} from "../types/owner-booking";
import type { OwnerBookingStats } from "../types/owner-booking-stats";

export const hostBookingsApi = {
  getOwnerBookings: async (
    params: OwnerBookingsFilter = {},
  ): Promise<PaginatedResponse<OwnerBooking>> => {
    const response = await api.get<PaginatedResponse<OwnerBooking>>(
      API_CONFIG.ENDPOINTS.TURF_BOOKINGS.OWNER_BOOKINGS,
      { params },
    );
    return response.data;
  },

  getOwnerStats: async (turfIds?: string[]): Promise<OwnerBookingStats> => {
    const response = await api.get<OwnerBookingStats>(
      API_CONFIG.ENDPOINTS.TURF_BOOKINGS.OWNER_STATS,
      {
        params: turfIds?.length ? { turfIds: turfIds.join(",") } : undefined,
      },
    );
    return response.data;
  },

  getById: async (id: string): Promise<OwnerBooking> => {
    const response = await api.get<OwnerBooking>(
      API_CONFIG.ENDPOINTS.TURF_BOOKINGS.BY_ID(id),
    );
    return response.data;
  },

  update: async (
    id: string,
    payload: UpdateOwnerBookingPayload,
  ): Promise<OwnerBooking> => {
    const response = await api.patch<OwnerBooking>(
      API_CONFIG.ENDPOINTS.TURF_BOOKINGS.BY_ID(id),
      payload,
    );
    return response.data;
  },

  confirm: (id: string) =>
    hostBookingsApi.update(id, { status: "confirmed" as TurfBookingStatus }),

  complete: (id: string) =>
    hostBookingsApi.update(id, { status: "completed" as TurfBookingStatus }),

  cancel: (id: string, cancelReason: string) =>
    hostBookingsApi.update(id, {
      status: "cancelled" as TurfBookingStatus,
      cancelReason,
    }),
};
