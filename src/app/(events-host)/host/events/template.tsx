import ProtectedPage from "@/guards/ProtectedPage";
import HostSideBar from "./_components/host-sidebar";

export default function HostEventsTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedPage>
      <div className="flex h-[calc(100dvh-4rem)] flex-col overflow-hidden bg-gray-50 py-8">
        <div className="mx-auto flex min-h-0 w-full max-w-6xl flex-1 flex-col gap-4 px-4 sm:px-6 md:flex-row md:gap-8 lg:px-8">
          <HostSideBar />
          <main className="flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </ProtectedPage>
  );
}
