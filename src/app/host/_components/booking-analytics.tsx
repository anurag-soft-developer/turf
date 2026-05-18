"use client";

import type { ComponentType } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useOwnerBookingStats } from "@/modules/host/hooks/use-owner-booking-stats";
import { Calendar, CheckCircle2, IndianRupee, TrendingUp } from "lucide-react";

function StatCard({
  title,
  value,
  trend,
  icon: Icon,
  accent,
}: {
  title: string;
  value: string;
  trend?: string;
  icon: ComponentType<{ className?: string }>;
  accent: string;
}) {
  return (
    <Card>
      <CardContent className="pt-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">{value}</p>
            {trend ? (
              <p className="mt-1 text-xs text-emerald-600">{trend}</p>
            ) : null}
          </div>
          <div className={`rounded-lg p-2 ${accent}`}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function BookingAnalytics() {
  const { data: stats, isLoading, isError } = useOwnerBookingStats();

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="h-24 animate-pulse bg-muted/40 pt-4" />
          </Card>
        ))}
      </div>
    );
  }

  if (isError || !stats) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          Unable to load booking analytics right now.
        </CardContent>
      </Card>
    );
  }

  return (
    <section>
      <h2 className="mb-4 text-xl font-bold text-gray-900">Booking Analytics</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Today's Bookings"
          value={String(stats.todaysBookings.count)}
          trend={stats.todaysBookings.trend}
          icon={Calendar}
          accent="bg-blue-100 text-blue-600"
        />
        <StatCard
          title="This Week"
          value={String(stats.thisWeekBookings.count)}
          trend={stats.thisWeekBookings.trend}
          icon={TrendingUp}
          accent="bg-purple-100 text-purple-600"
        />
        <StatCard
          title="Total Revenue"
          value={`₹${stats.totalRevenue.count}`}
          trend={stats.totalRevenue.trend}
          icon={IndianRupee}
          accent="bg-emerald-100 text-emerald-600"
        />
        <StatCard
          title="Completion Rate"
          value={`${stats.completionRate.count}%`}
          trend={stats.completionRate.trend}
          icon={CheckCircle2}
          accent="bg-amber-100 text-amber-600"
        />
      </div>
    </section>
  );
}
