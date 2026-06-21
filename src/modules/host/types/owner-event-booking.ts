import type { HostEvent } from "./event";

export type EventBookingStatus =
  | "pending"
  | "confirmed"
  | "cancelled"
  | "completed";

export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export interface BookedByUser {
  _id: string;
  fullName?: string;
  email?: string;
  phone?: string;
}

export interface OwnerEventBooking {
  _id: string;
  event: HostEvent | string;
  bookedBy: BookedByUser | string;
  fullName: string;
  contactNumber: string;
  notes?: string;
  playerCount?: number;
  totalAmount: number;
  status: EventBookingStatus;
  paymentStatus?: PaymentStatus;
  bookingId?: string;
  cancelReason?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface OwnerEventBookingsFilter {
  event?: string;
  status?: EventBookingStatus;
  page?: number;
  limit?: number;
  sortOrder?: "asc" | "desc";
}

export interface UpdateOwnerEventBookingPayload {
  status?: EventBookingStatus;
  cancelReason?: string;
}
