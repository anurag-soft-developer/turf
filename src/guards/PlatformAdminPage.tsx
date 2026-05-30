"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useProfile } from "@/lib/hooks/auth";
import { isPlatformAdmin } from "@/types/auth";
import { Loader2 } from "lucide-react";
import { redirect } from "next/navigation";
import ProtectedPage from "./ProtectedPage";

interface PlatformAdminPageProps {
  children: React.ReactNode;
}

export default function PlatformAdminPage({ children }: PlatformAdminPageProps) {
  const { data: user, isLoading } = useProfile();

  if (isLoading) {
    return (
      <ProtectedPage>
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        </div>
      </ProtectedPage>
    );
  }

  if (!isPlatformAdmin(user)) {
    redirect("/");
  }

  return <ProtectedPage>{children}</ProtectedPage>;
}
