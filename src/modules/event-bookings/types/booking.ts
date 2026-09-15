import type { HostEvent } from "@/types/event";

export type EventBookingStatus = "pending" | "confirmed" | "cancelled" | "completed";
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export interface BookedByUser {
  _id: string;
  fullName?: string;
  email?: string;
  phone?: string;
}

export interface EventBooking {
  _id: string;
  event: HostEvent | string;
  bookedBy: BookedByUser | string;
  fullName: string;
  contactNumber: string;
  notes?: string;
  playerCount?: number;
  totalAmount: number;
  status: EventBookingStatus;
  paymentStatus: PaymentStatus;
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

export interface CreateEventBookingPayload {
  fullName: string;
  contactNumber: string;
  notes?: string;
  playerCount?: number;
}

export interface RazorpayPaymentLinkResponse {
  id: string;
  shortUrl: string;
  callbackUrl: string;
}

export interface CreateEventBookingOrderResponse {
  booking: EventBooking;
  paymentLink?: RazorpayPaymentLinkResponse;
}

export interface VerifyHostedPaymentPayload {
  bookingId: string;
  razorpay_payment_link_id: string;
  razorpay_payment_link_reference_id: string;
  razorpay_payment_link_status: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface MyEventBookingsFilter {
  event?: string | string[];
  status?: EventBookingStatus;
  paymentStatus?: PaymentStatus;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
  sortOrder?: "asc" | "desc";
}
