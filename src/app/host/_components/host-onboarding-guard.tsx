"use client";

import { useHostOnboardingStatus } from "@/modules/host/hooks/use-host-onboarding";
import {
  isHostOnboardingComplete,
  needsHostOnboarding,
} from "@/modules/host/types/host-onboarding";
import { Loader2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

const ONBOARDING_PATH = "/host/onboarding";

export default function HostOnboardingGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { data, isLoading, isError } = useHostOnboardingStatus();

  const onOnboardingPage = pathname === ONBOARDING_PATH;
  const canPublish = isHostOnboardingComplete(data);
  const mustOnboard = needsHostOnboarding(data);

  useEffect(() => {
    if (isLoading || isError) return;

    if (!onOnboardingPage && mustOnboard) {
      router.replace(ONBOARDING_PATH);
      return;
    }

    if (onOnboardingPage && canPublish) {
      router.replace("/host");
    }
  }, [canPublish, isError, isLoading, mustOnboard, onOnboardingPage, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (!onOnboardingPage && mustOnboard) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  return <>{children}</>;
}
