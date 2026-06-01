"use client";

import { MyDrawer } from "@/components/my-drawer";
import { useState } from "react";
import PayoutDetailsForm from "./_components/payout-details-form";
import RequestWithdrawalForm from "./_components/request-withdrawal-form";
import WalletBalanceCards from "./_components/wallet-balance-cards";
import WithdrawalDetailPanel from "./_components/withdrawal-detail-panel";
import WithdrawalHistory from "./_components/withdrawal-history";

export default function HostWalletPage() {
  const [selectedWithdrawalId, setSelectedWithdrawalId] = useState<
    string | null
  >(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const openWithdrawal = (id: string) => {
    setSelectedWithdrawalId(id);
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setSelectedWithdrawalId(null);
    setDrawerOpen(false);
  };

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
      <WithdrawalHistory onSelectWithdrawal={openWithdrawal} />

      <MyDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        title="Withdrawal details"
        onClose={handleDrawerClose}
      >
        {selectedWithdrawalId ? (
          <WithdrawalDetailPanel id={selectedWithdrawalId} />
        ) : null}
      </MyDrawer>
    </div>
  );
}
