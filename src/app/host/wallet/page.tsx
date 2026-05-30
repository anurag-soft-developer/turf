"use client";

import { MyDrawer } from "@/components/my-drawer";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import PayoutDetailsForm from "./_components/payout-details-form";
import RequestWithdrawalForm from "./_components/request-withdrawal-form";
import WalletBalanceCards from "./_components/wallet-balance-cards";
import WithdrawalDetailPanel from "./_components/withdrawal-detail-panel";
import WithdrawalHistory from "./_components/withdrawal-history";

function WalletDrawer() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const drawer = searchParams.get("drawer");

  if (!drawer) return null;

  return (
    <MyDrawer
      title="Withdrawal details"
      onClose={() => router.push("/host/wallet")}
    >
      <WithdrawalDetailPanel id={drawer} />
    </MyDrawer>
  );
}

function HostWalletPageContent() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Wallet</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage earnings, payout details, and withdrawal requests.
        </p>
      </div>

      <WalletBalanceCards />
      <PayoutDetailsForm />
      <RequestWithdrawalForm />
      <WithdrawalHistory />
      <WalletDrawer />
    </div>
  );
}

export default function HostWalletPage() {
  return (
    <Suspense fallback={null}>
      <HostWalletPageContent />
    </Suspense>
  );
}
