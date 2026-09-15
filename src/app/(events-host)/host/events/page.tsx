import EventAnalytics from "./_components/event-analytics";
import EventManagementCards from "./_components/event-management-cards";

export default function HostEventsDashboardPage() {
  return (
    <div className="space-y-10">
      <EventAnalytics />
      <EventManagementCards />
    </div>
  );
}
