import { Turf, TimeSlot } from './turf';

export interface Booking {
  id: string;
  userId: string;
  turfId: string;
  turf: Turf;
  timeSlot: TimeSlot;
  date: string;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  createdAt: string;
  updatedAt: string;
}

export interface BookingRequest {
  turfId: string;
  timeSlotId: string;
  date: string;
  totalAmount: number;
}