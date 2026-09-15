import type { Turf } from "./turf";

export type TurfBookingStatus =
  | "pending"
  | "confirmed"
  | "cancelled"
  | "completed";

export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";
export type SlotHoldStatus = "active" | "released";

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
  razorpayPaymentId?: string;
  razorpayOrderId?: string;
  platformFeeAmount?: number;
  ownerPayoutAmount?: number;
  razorpayTransferId?: string;
  paidAt?: string;
  escrowCreditedAt?: string;
  escrowReleasedAt?: string;
  paymentExpiresAt?: string;
  slotHoldStatus?: SlotHoldStatus;
  refundId?: string;
  refundedAt?: string;
  refundAmount?: number;
  notes?: string;
  cancelReason?: string;
  cancelledAt?: string;
  confirmedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface OwnerBookingsFilter {
  turf?: string;
  bookedBy?: string;
  status?: TurfBookingStatus | TurfBookingStatus[];
  paymentStatus?: PaymentStatus;
  upcoming?: boolean;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface UpdateOwnerBookingPayload {
  timeSlots?: TimeSlot[];
  playerCount?: number;
  notes?: string;
  status?: TurfBookingStatus;
  paymentStatus?: PaymentStatus;
  razorpayPaymentId?: string;
  cancelReason?: string;
}
