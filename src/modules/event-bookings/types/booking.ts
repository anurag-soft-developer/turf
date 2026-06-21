import type { HostEvent } from "@/modules/host/types/event";

export type EventBookingStatus = "pending" | "confirmed" | "cancelled" | "completed";
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export interface EventBooking {
  _id: string;
  event: HostEvent | string;
  bookedBy: string;
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
  bookingId?: string;
  paidAt?: string;
  paymentExpiresAt?: string;
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
  status?: EventBookingStatus;
  page?: number;
  limit?: number;
  sortOrder?: "asc" | "desc";
}
