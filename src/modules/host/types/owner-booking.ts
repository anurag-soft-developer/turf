import type { Turf } from "./turf";

export type TurfBookingStatus =
  | "pending"
  | "confirmed"
  | "cancelled"
  | "completed";

export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export interface TimeSlot {
  startTime: string;
  endTime: string;
}

export interface BookedByUser {
  _id: string;
  fullName?: string;
  email?: string;
  phone?: string;
}

export interface OwnerBooking {
  _id: string;
  turf: Turf | string;
  bookedBy: BookedByUser | string;
  timeSlots?: TimeSlot[];
  playerCount?: number;
  totalAmount?: number;
  status: TurfBookingStatus;
  paymentStatus?: PaymentStatus;
  notes?: string;
  cancelReason?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface OwnerBookingsFilter {
  turf?: string;
  status?: TurfBookingStatus;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface UpdateOwnerBookingPayload {
  status?: TurfBookingStatus;
  cancelReason?: string;
}
