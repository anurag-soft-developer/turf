import ProtectedPage from "@/guards/ProtectedPage";
import HostNav from "./_components/host-nav";

export default function HostTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedPage>
      <div className="bg-gray-50 py-8">
        <div className="mx-auto max-w-5xl space-y-8 px-4 sm:px-6 lg:px-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Host portal</h1>
            <p className="mt-1 text-gray-600">
              Manage your turfs and bookings.
            </p>
          </div>
          <HostNav />
          {children}
        </div>
      </div>
    </ProtectedPage>
  );
}
