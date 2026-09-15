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
  razorpayPaymentId?: string;
  razorpayOrderId?: string;
  razorpayPaymentLinkId?: string;
  razorpayPaymentLinkShortUrl?: string;
  razorpayPaymentLinkCallbackUrl?: string;
  platformFeeAmount?: number;
  organizerPayoutAmount?: number;
  bookingId?: string;
  paidAt?: string;
  escrowCreditedAt?: string;
  escrowReleasedAt?: string;
  paymentExpiresAt?: string;
  refundId?: string;
  refundedAt?: string;
  refundAmount?: number;
  cancelReason?: string;
  cancelledAt?: string;
  confirmedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface OwnerEventBookingsFilter {
  event?: string | string[];
  status?: EventBookingStatus | EventBookingStatus[];
  paymentStatus?: PaymentStatus;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
  sortOrder?: "asc" | "desc";
}

export interface UpdateOwnerEventBookingPayload {
  status?: EventBookingStatus;
  paymentStatus?: PaymentStatus;
  cancelReason?: string;
}
