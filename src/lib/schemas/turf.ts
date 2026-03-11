import { z } from 'zod';

export const turfSearchSchema = z.object({
  location: z.string().optional(),
  sport: z.string().optional(),
  date: z.string().optional(),
  minPrice: z.number().min(0).optional(),
  maxPrice: z.number().min(0).optional(),
  amenities: z.array(z.string()).optional(),
  rating: z.number().min(1).max(5).optional(),
});

export const bookingSchema = z.object({
  turfId: z.string().min(1, 'Turf is required'),
  timeSlotId: z.string().min(1, 'Time slot is required'),
  date: z.string().min(1, 'Date is required'),
  totalAmount: z.number().min(0, 'Invalid amount'),
});

export const reviewSchema = z.object({
  turfId: z.string().min(1, 'Turf is required'),
  rating: z.number().min(1, 'Rating must be at least 1').max(5, 'Rating cannot exceed 5'),
  comment: z.string().min(5, 'Comment must be at least 5 characters long').max(1000, 'Comment cannot exceed 1000 characters'),
});

export const eventSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100, 'Title cannot exceed 100 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters').max(1000, 'Description cannot exceed 1000 characters'),
  sport: z.string().min(1, 'Sport is required'),
  turfId: z.string().optional(),
  date: z.string().min(1, 'Date is required'),
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().min(1, 'End time is required'),
  maxParticipants: z.number().min(2, 'At least 2 participants required').max(100, 'Too many participants'),
  entryFee: z.number().min(0, 'Entry fee cannot be negative'),
  isPublic: z.boolean().default(true),
});

// Type exports
export type TurfSearchFormData = z.infer<typeof turfSearchSchema>;
export type BookingFormData = z.infer<typeof bookingSchema>;
export type ReviewFormData = z.infer<typeof reviewSchema>;
export type EventFormData = z.infer<typeof eventSchema>;