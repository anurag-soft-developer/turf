import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { ROUTE_POINT } from "@/lib/constants/route-point";
import { Banknote, MapPin } from "lucide-react";

const adminSections = [
  {
    href: ROUTE_POINT.platformAdmin.withdrawals,
    title: "Withdrawals",
    description: "Review and process host withdrawal requests",
    icon: Banknote,
  },
  {
    href: ROUTE_POINT.platformAdmin.turfs,
    title: "Turf approvals",
    description: "Approve or reject turf listings submitted by hosts",
    icon: MapPin,
  },
];

export default function PlatformAdminPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Platform Admin</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Choose a section to manage.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {adminSections.map(({ href, title, description, icon: Icon }) => (
          <Link key={href} href={href} className="text-left">
            <Card className="h-full transition-shadow hover:shadow-md">
              <CardContent className="flex flex-col gap-3 pt-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-indigo-700">{title}</p>
                  <p className="text-sm text-muted-foreground">{description}</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
