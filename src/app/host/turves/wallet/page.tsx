"use client";

import { MyDrawer } from "@/components/my-drawer";
import { useState } from "react";
import PayoutDetailsSection from "./_components/payout-details-section";
import RequestWithdrawalForm from "./_components/request-withdrawal-form";
import WalletBalanceCards from "./_components/wallet-balance-cards";
import WithdrawalDetailPanel from "./_components/withdrawal-detail-panel";
import WithdrawalHistory from "./_components/withdrawal-history";

type WalletTab = "analytics" | "payout-details" | "withdrawals";

const TABS: { label: string; id: WalletTab }[] = [
  { label: "Analytics", id: "analytics" },
  { label: "Payout details", id: "payout-details" },
  { label: "Withdrawals", id: "withdrawals" },
];

export default function HostWalletPage() {
  const [activeTab, setActiveTab] = useState<WalletTab>("analytics");
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
    <div className="flex h-full min-h-0 flex-col overflow-y-auto">
      <div className="shrink-0 space-y-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Wallet</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage earnings, payout details, and withdrawal requests.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-full px-3 py-1 text-sm font-medium ring-1 ${
                activeTab === tab.id
                  ? "bg-emerald-600 text-white ring-emerald-600"
                  : "bg-white text-gray-700 ring-gray-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 min-h-0 flex-1 overflow-y-auto">
        {activeTab === "analytics" ? <WalletBalanceCards /> : null}

        {activeTab === "payout-details" ? <PayoutDetailsSection /> : null}

        {activeTab === "withdrawals" ? (
          <div className="flex flex-col gap-6">
            <div className="shrink-0">
              <RequestWithdrawalForm
                onGoToPayout={() => setActiveTab("payout-details")}
              />
            </div>
            <WithdrawalHistory onSelectWithdrawal={openWithdrawal} />
          </div>
        ) : null}
      </div>

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
