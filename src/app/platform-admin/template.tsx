import PlatformAdminPage from "@/guards/PlatformAdminPage";
import PlatformAdminSidebar from "./_components/platform-admin-sidebar";

export default function PlatformAdminTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PlatformAdminPage>
      <div className="min-h-[calc(100vh-4rem)] bg-slate-50 py-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 sm:px-6 md:flex-row md:gap-8 lg:px-8">
          <PlatformAdminSidebar />
          <main className="min-w-0 flex-1">{children}</main>
        </div>
      </div>
    </PlatformAdminPage>
  );
}
