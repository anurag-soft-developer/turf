import { turfNewDrawerUrl } from "@/app/host/_lib/turf-drawer-urls";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Plus } from "lucide-react";

export default function TurfManagementCards() {
  return (
    <section>
      <h2 className="mb-4 text-xl font-bold text-gray-900">Turf Management</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <Link href={turfNewDrawerUrl()} className="text-left">
          <Card className="h-full transition-shadow hover:shadow-md">
            <CardContent className="flex flex-col gap-3 pt-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                <Plus className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-emerald-700">Add New Turf</p>
                <p className="text-sm text-muted-foreground">
                  Create a new turf listing
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link href="/host/turfs">
          <Card className="h-full transition-shadow hover:shadow-md">
            <CardContent className="flex flex-col gap-3 pt-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-emerald-700">My Turfs</p>
                <p className="text-sm text-muted-foreground">
                  View and manage your listings
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </section>
  );
}
