import BookingAnalytics from "./_components/booking-analytics";
import TurfManagementCards from "./_components/turf-management-cards";

export default function HostDashboardPage() {
  return (
    <div className="space-y-10">
      <BookingAnalytics />
      <TurfManagementCards />
    </div>
  );
}
