"use client";

import { MyDrawer } from "@/components/my-drawer";
import { useState } from "react";
import {
  AdminWithdrawalDetailPanel,
  default as AdminWithdrawalsList,
} from "./_components/admin-withdrawals-content";

export default function PlatformAdminWithdrawalsPage() {
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
    <>
      <AdminWithdrawalsList onSelectWithdrawal={openWithdrawal} />

      <MyDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        title="Withdrawal request"
        onClose={handleDrawerClose}
      >
        {selectedWithdrawalId ? (
          <AdminWithdrawalDetailPanel id={selectedWithdrawalId} />
        ) : null}
      </MyDrawer>
    </>
  );
}
