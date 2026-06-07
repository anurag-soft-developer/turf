import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { ROUTE_POINT } from "@/lib/constants/route-point";
import { CalendarDays, Plus } from "lucide-react";

export default function EventManagementCards() {
  return (
    <section>
      <h2 className="mb-4 text-xl font-bold text-gray-900">Event Management</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <Link href={`${ROUTE_POINT.host.events.events}?drawer=new`} className="text-left">
          <Card className="h-full transition-shadow hover:shadow-md">
            <CardContent className="flex flex-col gap-3 pt-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                <Plus className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-emerald-700">Add New Event</p>
                <p className="text-sm text-muted-foreground">
                  Create and publish a new event
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link href={ROUTE_POINT.host.events.events}>
          <Card className="h-full transition-shadow hover:shadow-md">
            <CardContent className="flex flex-col gap-3 pt-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                <CalendarDays className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-emerald-700">Manage Events</p>
                <p className="text-sm text-muted-foreground">
                  View, edit and track your events
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </section>
  );
}
