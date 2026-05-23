import ProtectedPage from "@/guards/ProtectedPage";
import HostOnboardingGuard from "./_components/host-onboarding-guard";
import HostSideBar from "./_components/host-sidebar";

export default function HostTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedPage>
      <HostOnboardingGuard>
        <div className="min-h-[calc(100vh-4rem)] bg-gray-50 py-8">
          <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 sm:px-6 md:flex-row md:gap-8 lg:px-8">
            <HostSideBar />
            <main className="min-w-0 flex-1">{children}</main>
          </div>
        </div>
      </HostOnboardingGuard>
    </ProtectedPage>
  );
}
