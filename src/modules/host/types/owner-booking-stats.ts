export interface BookingMetric {
  count: number;
  trend?: string;
  trendInterval?: string;
}

export interface OwnerBookingStats {
  totalBookings: BookingMetric;
  todaysBookings: BookingMetric;
  thisWeekBookings: BookingMetric;
  totalRevenue: BookingMetric;
  completionRate: BookingMetric;
  bookingStatusStats: Record<string, number>;
}
