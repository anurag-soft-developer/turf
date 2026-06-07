"use client";

import type { ComponentType } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useHostEventStats } from "@/modules/host/hooks/use-my-events";
import { CalendarCheck2, CalendarClock, CircleCheck, Users } from "lucide-react";

function StatCard({
  title,
  value,
  icon: Icon,
  accent,
}: {
  title: string;
  value: string;
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
          </div>
          <div className={`rounded-lg p-2 ${accent}`}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function EventAnalytics() {
  const { data: stats, isLoading, isError } = useHostEventStats();

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
          Unable to load event analytics right now.
        </CardContent>
      </Card>
    );
  }

  return (
    <section>
      <h2 className="mb-4 text-xl font-bold text-gray-900">Event Analytics</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Events"
          value={String(stats.totalEvents)}
          icon={CalendarCheck2}
          accent="bg-blue-100 text-blue-600"
        />
        <StatCard
          title="Pending Approval"
          value={String(stats.pendingApprovalCount)}
          icon={CalendarClock}
          accent="bg-amber-100 text-amber-600"
        />
        <StatCard
          title="Published"
          value={String(stats.publishedCount)}
          icon={CircleCheck}
          accent="bg-emerald-100 text-emerald-600"
        />
        <StatCard
          title="Registrations"
          value={String(stats.totalRegistrations)}
          icon={Users}
          accent="bg-purple-100 text-purple-600"
        />
      </div>
    </section>
  );
}
